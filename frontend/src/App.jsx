import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/Register';
import ScriptsPage from './pages/ScriptPage';
import Navbar from './components/NavBar';
import './assets/global-assets.css';  


const NavigationHandler = ({ isAuth, userData }) => {
  const location = useLocation(); 
  const hideNavbarPaths = ['/login', '/register', '/'];  
  if (hideNavbarPaths.includes(location.pathname)) {
    return null;
  }

  return <Navbar isLoggedIn={isAuth} userPfp={userData.image} />;
};

function App() { 
  const [isAuth, setIsAuth] = useState(false); 
   
  const userData = {
    image: "https://via.placeholder.com/35"
  };

  return (
    <Router>   
      <NavigationHandler isAuth={isAuth} userData={userData} />
      
      <main className="app-container">
        <Routes> 
          <Route path="/login" element={<LoginPage setIsAuth={setIsAuth} />} /> 
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/scripts" element={<ScriptsPage />} /> 
          <Route path="/" element={<LoginPage setIsAuth={setIsAuth} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;