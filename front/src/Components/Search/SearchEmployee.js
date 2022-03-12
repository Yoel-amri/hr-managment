import { Autocomplete, Button, Modal, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EmployeeEdit from "../employee/EmployeeEdit";
import { Box } from "@mui/system";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  

export default function SearchEmployee({ me }) {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const selectCompany = (e) => {
    let company_id = companies.find(
      (company) => company.company_name === e.target.value
    );
    company_id = company_id?.company_id;
    setSelectedCompany(company_id);
  };

  const selectUserType = (e) => {
    setRole(e.target.value);
  };

  const search = (e) => {
    if (me.role === "SYSTEM_ADMIN") {
      let url = `${process.env.REACT_APP_BACKEND_URL}/api/system_admin/employee/findUsers?`;
      if (selectedCompany) url += `company_id=${selectedCompany}&`;
      if (role) url += `role=${role}&`;
      if (email) url += `email=${email}&`;
      axios
        .get(url, {
          withCredentials: true,
        })
        .then((res) => {
          setUsers(res.data);
        });
    }
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

  const searchUser = (user_id) => {
      setSelectedUser(user_id);
      setOpen(true)
  };

  return (
    <div>
      {me.role === "SYSTEM_ADMIN" && (
        <div style={{display: 'flex', flexDirection: 'column', paddingBottom:'20px'}}>
        <h1>Search Employee</h1>
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.company_id === value.company_id
            }
            onSelect={selectCompany}
            options={companies}
            sx={{ width: 300}}
            renderInput={(params) => (
              <TextField key={params.key} {...params} label="Companies" />
            )}
          />
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.company_id === value.company_id
            }
            onSelect={selectUserType}
            options={["ADMIN", "EMPLOYEE"]}
            sx={{ width: 300, marginTop:"10px"}}
            renderInput={(params) => (
              <TextField key={params.key} {...params} label="User type" />
            )}
          />
          <TextField
          sx={{width: 300, marginTop:"10px"}}
            label="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button sx={{width: 300, marginTop:"10px"}} variant="outlined" onClick={search}>
            Search
          </Button>
          <TableContainer sx={{ minWidth: 650,marginTop:"10px", }} component={Paper}>
            <Table
              sx={{ minWidth: 650,marginTop:"10px", }}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <TableCell align="right">Email</TableCell>
                  <TableCell align="right">First Name</TableCell>
                  <TableCell align="right">Last Name</TableCell>
                  <TableCell align="right">Role</TableCell>
                  <TableCell align="right">Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
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
                    <TableCell align="right">
                      {
                        <Button
                          variant="outlined"
                          onClick={() => searchUser(user.user_id)}
                        >
                          Details
                        </Button>
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <EmployeeEdit user_id={selectedUser}/>
            </Box>
          </Modal>
        </div>
      )}
    </div>
  );
}
