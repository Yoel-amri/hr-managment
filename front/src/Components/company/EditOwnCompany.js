import { Alert, Avatar, Button, Snackbar, TextField } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DatePickerSimple from '../datepicker/DatePicker';
import moment from 'moment';

export default function EditOwnCompany({me}) {
    const [severity, setSeverity] = useState('success');
    const [open, setOpen] = React.useState(false);
    const [alertMessage, setAlertMessage] = useState('Company updated succesfully !');
    const [profileImage, setProfileImage] = useState('');
    const [company, setCompany] = useState({
        company_name: '',
        email: '',
        company_id: '',
        address: '',
        phone_number:'',
        website: '',
        birthday: '',
        profile_image: ''
    });
    const [dateCreation, setDateCreation] = useState(moment(company.date_creation));

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
    };
    const updateCompany = () => {
        let companyBody = {
            ...company,
            date_creation: dateCreation.isValid() ? (dateCreation.toDate().getMonth()+1+'-'+dateCreation.toDate().getDate()+'-'+dateCreation.toDate().getFullYear()) : null,
        }
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admins/company/updateCompany`, companyBody,
        {
            withCredentials: true
        })
        .then((res) => {
            // setCompanyUpdated(true);
            setSeverity('success');
            setAlertMessage('Company updated succesfully !');
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
                "company_id",
                company.company_id
            )
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admins/company/updateCompanyImage`, formData, {
                withCredentials:true
            }).then((res) => {
                // setCompanyUpdated(true);
                setCompany({
                    ...company,
                    profile_image: res.data.profile_image
                })
            })
        }
    }

    const onFileChange =  event => {
        setProfileImage(event.target.files[0]);
    };

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admins/company/getOwnCompany`, {withCredentials:true})
        .then((res) => {
            setCompany(res.data);
            setDateCreation(moment(res.data.date_creation))
        })
    }, []);

    return (
    <div style={{display: "flex", flexDirection:'column', height: '600px', justifyContent:'space-between'}}>
        <Avatar sx={{ width: 100, height: 100 }} src={company.profile_image ?? ''} />

        <input type="file" onChange={onFileChange} />
        <TextField value={company.company_name ?? ''} onChange={e => setCompany({...company, company_name: e.target.value})} label="Company name" variant="outlined"/>
        <TextField value={company.address?? ''} onChange={e => setCompany({...company, address: e.target.value})} label="Address" variant="outlined"/>
        <TextField value={company.email ?? ''} onChange={e => setCompany({...company, email: e.target.value})} label="Email" variant="outlined"/>
        <TextField value={company.phone_number ?? ''} onChange={e => setCompany({...company, phone_number: e.target.value})} label="Phone number" variant="outlined"/>
        <TextField value={company.postal_code ?? ''} onChange={e => setCompany({...company, postal_code: e.target.value})} label="Postal Code" variant="outlined"/>
        <TextField value={company.website ?? ''} onChange={e => setCompany({...company, website: e.target.value})} label="Website" variant="outlined"/>
        <DatePickerSimple value={dateCreation ?? ''} onChange={(e) => setDateCreation(e)} />
        <Button variant='outlined' onClick={updateCompany}>Save</Button>

        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {alertMessage}
            </Alert>
        </Snackbar>

    </div>
  )
}
