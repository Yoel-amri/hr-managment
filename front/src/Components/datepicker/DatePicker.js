import React from 'react'
import TextField from '@mui/material/TextField';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

export default function zDatePickerSimple({label, value, onChange, disabled}) {
    return (
      <LocalizationProvider dateAdapter={DateAdapter}>
        <DatePicker
          disabled={disabled}
          label={label}
          value={value}
          onChange={onChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    );
}
