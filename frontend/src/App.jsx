import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/Register'
import ScriptsPage from './pages/ScriptPage';

function App() {
  return (
    <Router>
      <Routes> 
        <Route path="/" element={<LoginPage />} /> 

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/scripts" element={<ScriptsPage />} />
      </Routes>
    </Router>
  );
}

export default App;