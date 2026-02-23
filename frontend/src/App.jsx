import { useState } from 'react' 
import './App.css'
import LoginPage from './pages/auth/LoginPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <LoginPage />
    </div>
  );
}

export default App
