import React, {useState} from 'react';
import {Button, TextField, Grid} from '@mui/material';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const baseURL = 'http://localhost:8000';
if (typeof baseURL !== 'undefined') {
  axios.defaults.baseURL = baseURL;
}

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [confirmError, setConfirmError] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleConfirmChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (formData.password === e.target.value || formData.password.length > e.target.value.length) {
      setConfirmError((e) => false)
    } else {
      setConfirmError((e) => true)

    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // send axios request to backend server
    axios.post('http://localhost:8000/auth/register', {
      email: formData.email,
      password: formData.password,
    })
      .then(response => {
        console.log(response);
        navigate("/login");
        // handle successful response
      })
      .catch(error => {
        console.log(error);
        // handle error
      });
  }

  return (
    <form>
      <Grid
        container
        spacing={3}
        direction={'column'}
        justify={'center'}
        alignItems={'center'}
      >
        <div style={{padding: 30}}>

          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            fullWidth
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            fullWidth
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleConfirmChange}
            variant="outlined"
            margin="normal"
            error={confirmError}
            fullWidth
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Grid>
    </form>
  );
}
