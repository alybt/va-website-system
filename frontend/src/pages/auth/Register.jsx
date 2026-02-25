import { useState } from 'react';
import api from '../../api/axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'user' });
  const [msg, setMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg(''); 

    try {
        const response = await api.post('/register', formData);
        setMsg(response.data.message);
    } catch (err) {
 
        console.error("Full Error Object:", err); 
        setMsg(err.response?.data?.message || 'Error occurred');
    }
    };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <form onSubmit={handleRegister} className="p-8 bg-gray-800 rounded shadow-xl w-96">
        <h2 className="text-2xl mb-4 font-bold">Create Account</h2>
        {msg && <p className="mb-4 text-blue-400">{msg}</p>}
        
        <input 
          type="text" placeholder="Username" 
          className="w-full p-2 mb-4 bg-gray-700 rounded"
          onChange={(e) => setFormData({...formData, username: e.target.value})}
        />
        
        <input 
          type="password" placeholder="Password" 
          className="w-full p-2 mb-4 bg-gray-700 rounded"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />

         

        <button type='submit' className="w-full bg-green-600 p-2 rounded hover:bg-green-700 transition">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;