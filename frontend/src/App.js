import React from "react";
import logo from './logo.svg';
import './App.css';
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'
import Checkbox from '@mui/material/Checkbox'
import {FormControlLabel} from "@mui/material";
import {TextField} from "@mui/material";
import axios from "axios";
import RegistrationForm from "./Components/RegistrationForm";

async function buttonClick() {
  let response = await axios.get('http://127.0.0.1:8000')
  alert(response.data)
}


function CheckboxExample() {
  const [checked, setChecked] = React.useState(true)
  return (
    <FormControlLabel
      control={<Checkbox
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        color='primary'
        inputProps={{
          'aria-label': 'secondary checkbox'
        }}
      />}
      label="Testing Checkbox"
    />

  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TextField
          variant="outlined"
          color="secondary"
        />
        <CheckboxExample/>
        <img src={logo} className="App-logo" alt="logo"/>
        <ButtonGroup>
          <Button
            startIcon={<SaveIcon/>}
            size='large' variant='contained' color='primary'
            onClick={() => buttonClick()}
          >
            Save
          </Button>
          <Button
            startIcon={<DeleteIcon/>}
            size='large' variant='contained' color='secondary'
          >
            Discard
          </Button>
        </ButtonGroup>
        <RegistrationForm/>
      </header>
    </div>
  );
}

export default App;
