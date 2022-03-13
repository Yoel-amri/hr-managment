import { Avatar, TextField } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DatePickerSimple from '../datepicker/DatePicker';
import moment from 'moment';

export default function ShowCompany({me}) {
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


    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/employee/company/getOwnCompany`, {withCredentials:true})
        .then((res) => {
            setCompany(res.data);
            setDateCreation(moment(res.data.date_creation))
        })
    }, []);

    return (
    <div style={{display: "flex", flexDirection:'column', height: '600px', justifyContent:'space-between'}}>
        <Avatar sx={{ width: 100, height: 100 }} src={company.profile_image ?? ''} />

        <TextField disabled value={company.company_name ?? ''} onChange={e => setCompany({...company, company_name: e.target.value})} label="Company name" variant="outlined"/>
        <TextField disabled value={company.address?? ''} onChange={e => setCompany({...company, address: e.target.value})} label="Address" variant="outlined"/>
        <TextField disabled value={company.email ?? ''} onChange={e => setCompany({...company, email: e.target.value})} label="Email" variant="outlined"/>
        <TextField disabled value={company.phone_number ?? ''} onChange={e => setCompany({...company, phone_number: e.target.value})} label="Phone number" variant="outlined"/>
        <TextField disabled value={company.postal_code ?? ''} onChange={e => setCompany({...company, postal_code: e.target.value})} label="Postal Code" variant="outlined"/>
        <TextField disabled value={company.website ?? ''} onChange={e => setCompany({...company, website: e.target.value})} label="Website" variant="outlined"/>
        <DatePickerSimple disabled={true} value={dateCreation ?? ''} onChange={(e) => setDateCreation(e)} />
    </div>
  )
}
