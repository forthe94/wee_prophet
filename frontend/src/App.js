import React from "react";
import './App.css';
import Header from './Components/Header.js';import axios from "axios";
import RegistrationForm from "./Components/RegistrationForm";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import LoginPage from "./Pages/login";
import LogoutPage from "./Pages/logout";
import ProfilePage from "./Pages/profile";



function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />

        </Routes>
      </Router>

    </div>
  );
}

export default App;
