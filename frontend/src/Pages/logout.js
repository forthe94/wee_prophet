import React from 'react'
import Box from "@mui/material/Box"

class LogoutPage extends React.Component {
  componentDidMount() {
    // call api or anything
    console.log("Component has been rendered");
    localStorage.removeItem('token')
  }

  render() {
    return (
      <div >
        <Box sx={{ display: 'inline' }}>
          Logout successful
        </Box>
      </div>
    );
  }
}

export default LogoutPage;