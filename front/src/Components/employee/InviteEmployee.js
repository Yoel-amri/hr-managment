import {
  Alert,
  Autocomplete,
  Button,
  Snackbar,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import InvitationsHistory from "./InvitationsHistory";

export default function InviteEmployee({ me }) {
  const [severity, setSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('Employee invited !');
  const [accountType, setAccountType] = useState("");
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [email, setEmail] = useState("");
  const [updatedInvites, setUpdatesInvites] = useState(false);

  const accounts = (role) => {
    return role === "SYSTEM_ADMIN"
      ? ["SYSTEM_ADMIN", "ADMIN", "EMPLOYEE"]
      : ["ADMIN", "EMPLOYEE"];
  };

  useEffect(() => {
    if (me.role === "SYSTEM_ADMIN") {
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/system_admin/company/getAllCompanies`,
          { withCredentials: true }
        )
        .then((res) => {
          setCompanies(
            res.data.map((company) => {
              return {
                label: company.company_name,
                ...company,
              };
            })
          );
        });
    }
  }, []);

  const [open, setOpen] = React.useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const selectCompany = (e) => {
    setSelectedCompany(
      companies.find((company) => company.company_name === e.target.value)
    );
  };

  const sendInvite = () => {
    const urlRole = me.role === "SYSTEM_ADMIN" ? "system_admin" : "admins";
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/api/${urlRole}/employee/inviteEmployee`,
        {
          role: accountType,
          email: email,
          company_id:
            me.role === "SYSTEM_ADMIN" ? selectedCompany.company_id : "",
        }, {
          withCredentials: true
        }
      )
      .then((res) => {
        setUpdatesInvites(true);
        setSeverity('success')
        setAlertMessage('Employee invited succesfully !');
        setOpen(true);
      }).catch((err) => {
        setSeverity('error')
        setAlertMessage('Error inviting employee please check input !');
        setOpen(true);
      });
  };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1>Invite employee</h1>
      <Autocomplete
        onSelect={(e) => setAccountType(e.target.value)}
        options={accounts(me.role)}
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField key={params.key} {...params} label="Role" />
        )}
      />
      {me.role === "SYSTEM_ADMIN" && accountType !== 'SYSTEM_ADMIN' && (
        <Autocomplete
          isOptionEqualToValue={(option, value) =>
            option.company_id === value.company_id
          }
          onSelect={selectCompany}
          options={companies}
          sx={{ width: 300, marginTop: "10px" }}
          renderInput={(params) => (
            <TextField key={params.key} {...params} label="Companies" />
          )}
        />
      )}
      <TextField
        sx={{ width: 300, marginTop: "10px" }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label="Email"
      />
      <Button
        onClick={sendInvite}
        sx={{ width: 300, marginTop: "10px" }}
        variant="outlined"
      >
        Invite
      </Button>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <InvitationsHistory me={me} setUpdatesInvites={setUpdatesInvites} updatedInvites={updatedInvites} />
    </div>
  );
}
