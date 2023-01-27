import React, { useState } from 'react';
import {Button, TextField} from '@mui/material';
import axios from 'axios';

const baseURL = 'http://localhost:8000';
if (typeof baseURL !== 'undefined') {
  axios.defaults.baseURL = baseURL;
}

export default function RegistrationForm() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // send axios request to backend server
    axios.post('/', formData)
      .then(response => {
        console.log(response);
        // handle successful response
      })
      .catch(error => {
        console.log(error);
        // handle error
      });
  }

  return (
    <form>
      <div>
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
          onChange={handleChange}
          variant="outlined"
          margin="normal"
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
    </form>
  );
}
