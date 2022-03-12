import { Alert, Avatar, Button, Snackbar, TextField } from '@mui/material'
import axios from 'axios'
import React, { useState } from 'react'
import DatePickerSimple from '../datepicker/DatePicker';
import moment from 'moment';


export default function RegisterCompnay({}) {
    const [severity, setSeverity] = useState('success');
    const [open, setOpen] = React.useState(false);
    const [alertMessage, setAlertMessage] = useState('Company updated succesfully !');
    const [profileImage, setProfileImage] = useState('');
    const [profileImageSrc, setProfileImageSrc] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [website, setWebSite] = useState('');
    const [dateCreation, setDateCreation] = useState(moment(''));
    const [companyId, setCompanyId] = useState('');

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
    };
    const updateCompany = () => {
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/system_admin/company/createCompany`, {
            company_name: name,
            address: address,
            email: email,
            phone_number: phone,
            postal_code: postalCode,
            website: website,
            date_creation: dateCreation.isValid() ? (dateCreation.toDate().getMonth()+1+'-'+dateCreation.toDate().getDate()+'-'+dateCreation.toDate().getFullYear()) : null
        },
        {
            withCredentials: true
        })
        .then((res) => {
            if (profileImage) {
                const formData = new FormData();
                formData.append(
                    "profile_img",
                    profileImage,
                );
                formData.append(
                    "company_id",
                    res.data.company_id
                )
                axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/system_admin/company/UpdateProfileImage`, formData, {
                    withCredentials:true
                }).then((res) => {
                    setProfileImageSrc(res.data.profile_image)
                })
            }
            setSeverity('success');
            setAlertMessage('Company created succesfully !');
            setOpen(true);
        })
        .catch((err) => {
            setSeverity('error');
            setAlertMessage('Something went wrong, please check input!');
            setOpen(true);
        })
        
           
    }

    const onFileChange =  event => {
        setProfileImage(event.target.files[0]);
    };

    return (
    <div style={{display: "flex", flexDirection:'column', height: '600px', justifyContent:'space-between'}}>
        <Avatar sx={{ width: 100, height: 100 }} src={profileImageSrc} />

        <input type="file" onChange={onFileChange} />
        <TextField value={name} onChange={e => setName(e.target.value)} label="Company name" variant="outlined"/>
        <TextField value={address} onChange={e => setAddress(e.target.value)} label="Address" variant="outlined"/>
        <TextField value={email} onChange={e => setEmail(e.target.value)} label="Email" variant="outlined"/>
        <TextField value={phone} onChange={e => setPhone(e.target.value)} label="Phone number" variant="outlined"/>
        <TextField value={postalCode} onChange={e => setPostalCode(e.target.value)} label="Postal Code" variant="outlined"/>
        <TextField value={website} onChange={e => setWebSite(e.target.value)} label="Website" variant="outlined"/>
        <DatePickerSimple value={dateCreation} onChange={(e) => setDateCreation(e)} />
        <Button variant='outlined' onClick={updateCompany}>Save</Button>

        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {alertMessage}
            </Alert>
        </Snackbar>

    </div>
  )
}
