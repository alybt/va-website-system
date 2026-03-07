import React, { useState } from 'react';
import Navbar from './components/NavBar';

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/Register';
import ScriptsPage from './pages/ScriptPage';
import HomePage from './pages/HomePage';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import './assets/global-assets.css';


const NavigationHandler = () => {
  const {isAuth, user} = useAuth();
  const location = useLocation(); 
  const hideNavbarPaths = ['/login', '/register'];  
  if (hideNavbarPaths.includes(location.pathname)) return null;

  return <Navbar />;
};

function App() { 
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>   
          <NavigationHandler />
          <main className="app-container">
            <Routes> 
              <Route path="/login" element={<LoginPage />} /> 
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/scripts" element={<ScriptsPage />} /> 
              <Route path="/" element={<HomePage />} />
            </Routes>
          </main>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

// const { user, isAuth } = useAuth();

// const { isAuth, logout } = useAuth();

// const { token } = useAuth();