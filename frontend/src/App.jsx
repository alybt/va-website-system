import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/Register'
function App() {
  return (
    <Router>
      <Routes>
        {/* This makes the LoginPage show up at http://localhost:5173/ */}
        <Route path="/" element={<LoginPage />} />
        
        {/* This will be your register page once you create it */}
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;