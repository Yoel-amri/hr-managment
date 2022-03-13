import { Alert, Avatar, Button, Snackbar, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment";

import DatePickerSimple from "../datepicker/DatePicker";

export default function EmployeeEdit({ user_id, role }) {
  const [userInfo, setUserInfo] = useState({
    address: "",
    birthday: "",
    department: "",
    email: "",
    firstname: "",
    invitation: "",
    lastname: "",
    phone_number: "",
    postal_code: "",
    profile_image: "",
    remarks: "",
    role: "",
    user_id: "",
  });
  const [profileImage, setProfileImage] = useState("");
  const [profileImageSrc, setProfileImageSrc] = useState("");
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

  useEffect(() => {
    let apiRole = "system_admin"
    if (role === "ADMIN") apiRole = "admins"
    if (role === 'EMPLOYEE') apiRole = 'employee'
    console.log(role);
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/${apiRole}/employee/getEmployeeInfo?user_id=${user_id}`,
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data);
        setUserInfo(res.data[0]);
        setBirthday(moment(res?.data[0]?.birthday))
      });
  }, []);

  const onFileChange = (event) => {
    setProfileImage(event.target.files[0]);
  };

  const updateUser = () => {
      // console.log(birthday);
    let apiRole = "system_admin";
    if (role === "ADMIN") apiRole = "admins";
    if (role === 'EMPLOYEE') apiRole = 'employee'

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/${apiRole}/employee/updateProfile`, {
        user_id: user_id,
        ...userInfo,
        birthday: birthday.isValid() ? (birthday.toDate().getMonth()+1+'-'+birthday.toDate().getDate()+'-'+birthday.toDate().getFullYear()) : null
    },{withCredentials: true})
    .then((res) => {
        setSeverity('success');
        setAlertMessage('Employee updated succesfully !');
        setOpen(true);
    })
    .catch((res) => {
        setSeverity('error');
        setAlertMessage('Something went wrong, please check input!');
        setOpen(true);
    })

    if (profileImage) {
        const formData = new FormData();

        formData.append(
            "profile_img",
            profileImage,
        );
        formData.append(
            "user_id",
            user_id
        )
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/${apiRole}/employee/updateProfileImage`, formData, {
            withCredentials:true
        }).then((res) => {
            setUserInfo({...userInfo, profile_image: res.data.profile_image})
        })
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "700px",
          justifyContent: "space-between",
          overflow:'auto'
        }}
      >
        <Avatar sx={{ width: 100, height: 100 }} src={userInfo?.profile_image} />
        <input type="file" onChange={onFileChange} />
        <TextField
          onChange={(e) =>
            setUserInfo({ ...userInfo, firstname: e.target.value })
          }
          value={userInfo?.firstname ?? ''}
          label="Firstname"
          variant="outlined"
        />
        <TextField
          onChange={(e) =>
            setUserInfo({ ...userInfo, lastname: e.target.value })
          }
          value={userInfo?.lastname ?? ''}
          label="Lastname"
          variant="outlined"
        />
        <TextField
          onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
          value={userInfo?.email ?? ''}
          label="Email"
          variant="outlined"
        />
        <TextField
          onChange={(e) =>
            setUserInfo({ ...userInfo, address: e.target.value })
          }
          value={userInfo?.address ?? ''}
          label="Address"
          variant="outlined"
        />
        <TextField
          onChange={(e) =>
            setUserInfo({ ...userInfo, department: e.target.value })
          }
          value={userInfo?.department ?? ''}
          label="Department"
          variant="outlined"
        />
        <TextField
          onChange={(e) =>
            setUserInfo({ ...userInfo, phone_number: e.target.value })
          }
          value={userInfo?.phone_number ?? ''}
          label="Phone"
          variant="outlined"
        />

        <TextField
          onChange={(e) =>
            setUserInfo({ ...userInfo, postal_code: e.target.value })
          }
          value={userInfo?.postal_code ?? ''}
          label="Postal code"
          variant="outlined"
        />
        <TextField
          onChange={(e) =>
            setUserInfo({ ...userInfo, remarks: e.target.value })
          }
          value={userInfo?.remarks ?? ''}
          label="Website"
          variant="outlined"
        />
        <DatePickerSimple
          onChange={(e) => setBirthday(e)}
          value={birthday}
        />

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
