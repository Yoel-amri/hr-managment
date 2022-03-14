import { Button, FormControlLabel, Paper, Switch } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Alert, Snackbar } from "@mui/material";

export default function InvitationsHistory({ me, updatedInvites, setUpdatesInvites }) {
  const [showSysAdmin, setShowSysAdmin] = useState(false);
  const [systemAdmins, setSystemAdmins] = useState([]);

  const [history, setHistory] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("Employee invited !");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    let roleUrl = "admins";
    if (me.role === "SYSTEM_ADMIN") roleUrl = "system_admin";
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/${roleUrl}/employee/invitations`,
        { withCredentials: true }
      )
      .then((res) => {
        setUpdatesInvites(false);
        setHistory(res.data);
      });
  }, [updatedInvites]);

  const cancelInvite = (user_id) => {
    let roleUrl = "admins";
    if (me.role === "SYSTEM_ADMIN") roleUrl = "system_admin";
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/api/${roleUrl}/employee/cancelInvite`,
        {
          user_id: user_id,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (showSysAdmin) {
          const canceledSysAdmin = systemAdmins.map((one) => {
            if (one.user_id === user_id) {
              one.invitation = "REFUSED";
            }
            return one;
          });
          setSystemAdmins(canceledSysAdmin);
        } else {
          const canceledHistory = history.map((one) => {
            if (one.user_id === user_id) {
              one.invitation = "REFUSED";
            }
            return one;
          });
          setHistory(canceledHistory);
        }
        setSeverity("success");
        setAlertMessage("Invite canceled!");
        setOpen(true);
      })
      .catch((err) => {
        setSeverity("error");
        setAlertMessage("Error canceling invite!");
        setOpen(true);
      });
  };

  useEffect(() => {
    if (showSysAdmin && me.role === "SYSTEM_ADMIN") {
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/system_admin/getSystemAdmins`,
          { withCredentials: true }
        )
        .then((res) => {
          setSystemAdmins(res.data);
          setUpdatesInvites(false);
        });
    }
  }, [showSysAdmin, updatedInvites]);

  return (
    <div>
      {me.role === "SYSTEM_ADMIN" && (
        <FormControlLabel
          control={
            <Switch
              value={showSysAdmin}
              onChange={(e) => setShowSysAdmin(!showSysAdmin)}
            />
          }
          label="Only show system admins."
        ></FormControlLabel>
      )}
      {!showSysAdmin && (
        <TableContainer
          sx={{ minWidth: 650, marginTop: "10px" }}
          component={Paper}
        >
          <Table
            sx={{ minWidth: 650, marginTop: "10px" }}
            size="small"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Company name</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">First Name</TableCell>
                <TableCell align="right">Last Name</TableCell>
                <TableCell align="right">Account Type</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((user) => (
                <TableRow
                  key={user.user_id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.company_name}
                  </TableCell>
                  <TableCell align="right">{user.email}</TableCell>
                  <TableCell align="right">{user.firstname}</TableCell>
                  <TableCell align="right">{user.lastname}</TableCell>
                  <TableCell align="right">{user.role}</TableCell>
                  <TableCell align="right">{user.invitation}</TableCell>
                  <TableCell align="right">
                    {user.invitation === "WAITING" && (
                      <Button
                        color="error"
                        variant="outlined"
                        onClick={() => {
                          cancelInvite(user.user_id);
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {showSysAdmin && (
        <TableContainer
          sx={{ minWidth: 650, marginTop: "10px" }}
          component={Paper}
        >
          <Table
            sx={{ minWidth: 650, marginTop: "10px" }}
            size="small"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">First Name</TableCell>
                <TableCell align="right">Last Name</TableCell>
                <TableCell align="right">Account Type</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {systemAdmins.map((user) => (
                <TableRow
                  key={user.user_id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="right">{user.email}</TableCell>
                  <TableCell align="right">{user.firstname}</TableCell>
                  <TableCell align="right">{user.lastname}</TableCell>
                  <TableCell align="right">{user.role}</TableCell>
                  <TableCell align="right">{user.invitation}</TableCell>
                  <TableCell align="right">
                    {user.invitation === "WAITING" && (
                      <Button
                        color="error"
                        variant="outlined"
                        onClick={() => {
                          cancelInvite(user.user_id);
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
