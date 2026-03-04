import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/Register';
import ScriptsPage from './pages/ScriptPage';
import Navbar from './components/NavBar';
import HomePage from './pages/HomePage';
import './assets/global-assets.css';

// ✅ stays here, above App
const NavigationHandler = ({ isAuth, userData }) => {
  const location = useLocation(); 
  const hideNavbarPaths = ['/login', '/register'];  
  if (hideNavbarPaths.includes(location.pathname)) return null;

  return <Navbar isLoggedIn={isAuth} userPfp={userData.image} />;
};

function App() { 
  const [isAuth, setIsAuth] = useState(false);
  const userData = { image: "https://via.placeholder.com/35" };

  return (
    <ThemeProvider>
      <Router>   
        <NavigationHandler isAuth={isAuth} userData={userData} />
        <main className="app-container">
          <Routes> 
            <Route path="/login" element={<LoginPage setIsAuth={setIsAuth} />} /> 
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/scripts" element={<ScriptsPage />} /> 
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
      </Router>
    </ThemeProvider>
  );
}

export default App;