import { Autocomplete, Button, Modal } from '@mui/material'
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CompanyEdit from '../company/CompanyEdit';

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


export default function SearchCompany() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companyUpdated, setCompanyUpdated] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/system_admin/company/getAllCompanies`, { withCredentials: true })
          .then(res => {
            setCompanies(res.data.map((company) => {
              return {
                label: company.company_name,
                ...company
              }
            }))
            setCompanyUpdated(false)
          })
  }, [companyUpdated])

  const selectCompany = (e) => {
    setSelectedCompany(companies.find(company => company.company_name === e.target.value))
  }

  const searchCompany = (e) => {
    if (selectedCompany){
      handleOpen(true);
    }
  }

  return (
    <div>
      <h1>Search Company</h1>
      <Autocomplete
        isOptionEqualToValue={(option, value) => option.company_id === value.company_id}
        onSelect={selectCompany}
        options={companies}
        sx={{ width: 300 ,marginTop:'10px'}}
        renderInput={(params) => <TextField key={params.key} {...params} label="Companies" />}
      />
      <Button sx={{ width: 300 ,marginTop:'10px'}} onClick={searchCompany} variant='contained'>Search </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CompanyEdit setCompanyUpdated={setCompanyUpdated} company={selectedCompany} />
        </Box>
      </Modal>
    </div>
  )
}
