import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/Register';
import ScriptsPage from './pages/ScriptPage';
import Navbar from './components/NavBar';
import './assets/global-assets.css';

function App() {
  return (
    <Router> 
      
      <Navbar isLoggedIn={true} userPfp="https://via.placeholder.com/35" />  
      <main className="app-container">
        <Routes> 
          <Route path="/" element={<LoginPage />} /> 
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/scripts" element={<ScriptsPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;