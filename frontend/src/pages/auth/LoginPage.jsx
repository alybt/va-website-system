import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import styles from './LoginPage.module.css'; 

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/login', formData);
      console.log('Login Success:', response.data);
      alert('Logged in successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formCard}>
        <h2 className={styles.title}>Login</h2>
        
        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.inputGroup}>
          <label className={styles.label}>Username: </label>
          <input
            type="text" 
            className={styles.inputField}
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Password: </label>
          <input
            type="password"
            className={styles.inputField}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          Sign In
        </button>

        <div className={styles.footer}>
          <p>
            Don't have an account?{' '}
            <Link to="/register" className={styles.link}>
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;