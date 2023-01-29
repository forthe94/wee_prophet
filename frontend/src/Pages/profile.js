import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import {styled} from '@mui/material/styles';
import axios from "axios";
import React from "react"
import {Button} from "@mui/material";

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
    console.log("state=", this.state)
    if (token) {
      axios.get(
        'http://localhost:8000/users/me', {
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

  handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token')

    // send axios request to backend server
    axios.post('http://localhost:8000/deed-record', {
        'example': 'data'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )
      .then(response => {
        console.log(response);
        // handle successful response
      })
      .catch(error => {
        console.log(error);
        // handle error
      });
  }


  render() {
    var renderPage = <Item> Loading </Item>
    var profilePage = <div>
      <Item> Your profile {this.state.profile} </Item>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        fullWidth
        onClick={this.handleSubmit}
      > Add deed </Button>
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

    if (this.state.error === true){
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