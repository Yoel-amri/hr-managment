
import { useLocation, useNavigate} from "react-router-dom";
import { Alert, Button, Snackbar, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

import DatePickerSimple from "../../Components/datepicker/DatePicker";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function SignUp() {
  let query = useQuery();
  const signUpToken = query.get("token");
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    address: "",
    birthday: "",
    department: "",
    firstname: "",
    invitation: "",
    lastname: "",
    phone_number: "",
    postal_code: "",
    profile_image: "",
    remarks: "",
    role: "",
    user_id: "",
    password: "",
    passwordConfirmation: ""
  });
  const [birthday, setBirthday] = useState();
  const [severity, setSeverity] = useState("success");
  const [open, setOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = useState(
    "User updated succesfully !"
  );

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // const onFileChange = (event) => {
  //   setProfileImage(event.target.files[0]);
  // };

  const updateUser = () => {
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/signUp/${signUpToken}`, {
        ...userInfo,
        birthday: birthday?.isValid() ? (birthday.toDate().getMonth()+1+'-'+birthday.toDate().getDate()+'-'+birthday.toDate().getFullYear()) : null
    }).then((res) => {

        setAlertMessage('User sign up  please log in !');
        setSeverity('success')
        setOpen(true);
        navigate('/login', {replace: true})
    }).catch(e => {
        setAlertMessage('Error signing up user, please check input !');
        setSeverity('error')
        setOpen(true)
    })
  };

  return (
    <div style={{padding: '100px 400px 100px 400px'}}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "700px",
          justifyContent: "space-between",
          overflow: "auto",
        }}
      >
        {/* <Avatar
          sx={{ width: 100, height: 100 }}
          src={userInfo?.profile_image}
        /> */}
        {/* <input type="file" onChange={onFileChange} /> */}
        <TextField
          onChange={(e) =>
            setUserInfo({ ...userInfo, firstname: e.target.value })
          }
          value={userInfo?.firstname ?? ""}
          label="Firstname"
          variant="outlined"
        />
        <TextField
          onChange={(e) =>
            setUserInfo({ ...userInfo, lastname: e.target.value })
          }
          value={userInfo?.lastname ?? ""}
          label="Lastname"
          variant="outlined"
        />
        <TextField
          onChange={(e) =>
            setUserInfo({ ...userInfo, address: e.target.value })
          }
          value={userInfo?.address ?? ""}
          label="Address"
          variant="outlined"
        />
        <TextField
          onChange={(e) =>
            setUserInfo({ ...userInfo, department: e.target.value })
          }
          value={userInfo?.department ?? ""}
          label="Department"
          variant="outlined"
        />
        <TextField
          onChange={(e) =>
            setUserInfo({ ...userInfo, phone_number: e.target.value })
          }
          value={userInfo?.phone_number ?? ""}
          label="Phone"
          variant="outlined"
        />

        <TextField
          onChange={(e) =>
            setUserInfo({ ...userInfo, postal_code: e.target.value })
          }
          value={userInfo?.postal_code ?? ""}
          label="Postal code"
          variant="outlined"
        />
        <TextField
          onChange={(e) =>
            setUserInfo({ ...userInfo, password: e.target.value })
          }
          value={userInfo.password}
          label="Password"
          variant="outlined"
        />
        <TextField
          onChange={(e) =>
            setUserInfo({ ...userInfo, passwordConfirmation: e.target.value })
          }
          value={userInfo.passwordConfirmation ?? ""}
          label="Confirm password"
          variant="outlined"
        />
        <DatePickerSimple onChange={(e) => setBirthday(e)} value={birthday} />

        <Button variant="outlined" onClick={updateUser}>
          Save
        </Button>

        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
