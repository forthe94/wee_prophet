import React from 'react';
import {
  Grid,
  TextField,
  Button
} from '@mui/material';
import {useState} from "react";
import axios from "axios";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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
    axios.post(
      'http://localhost:8000/auth/jwt/login',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
      .then(response => {
        console.log(response);
        localStorage.setItem('token', response.data['access_token']);
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
            label="Username"
            name="username"
            value={formData.username}
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
};

export default LoginPage;