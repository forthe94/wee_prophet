import React from "react";
import './App.css';
import Header from './Components/Header.js';import axios from "axios";
import RegistrationForm from "./Components/RegistrationForm";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import LoginPage from "./Pages/login";



function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginPage />} />

        </Routes>
      </Router>

    </div>
  );
}

export default App;
