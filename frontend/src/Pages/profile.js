import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import {styled} from '@mui/material/styles';
import axios from "axios";
import React from "react"
import DataGridDemo from "../Components/EditableTable";
import config from "../config.json"

const Item = styled(Paper)(({theme}) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authorized: null,
      error: null,
      profile: null
    };
  }

  componentWillMount() {

    const token = localStorage.getItem('token')
    if (token) {
      axios.get(
        config.SERVER_URL + '/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response)
          this.setState({'authorized': true, 'profile': response.data['email'], 'error': false})
        })
        .catch((error) => console.log(error));
      this.setState({'error': true})
    } else {
      this.setState({'authorized': false, 'error': false})
    }
  }

  render() {
    var renderPage = <Item> Loading </Item>

    var profilePage = <div>
      <Item> Your profile {this.state.profile} </Item>
      <DataGridDemo></DataGridDemo>
    </div>

    switch (this.state.authorized) {
      case false:
        renderPage = <Item> Not authorized</Item>
        break
      case true:
        renderPage = profilePage
        break
      default:
        break
    }

    if (this.state.error === true) {
      renderPage = <Item> Token expired </Item>
    }
    return (

      <div style={{
        padding: 30
      }
      }>
        <Box>

          <Grid
            alignItems="stretch"
            xs={10}
          >
            {renderPage}
          </Grid>
        </Box>
      </div>
    );
  }
}

export default ProfilePage;