import React, { useState, useContext } from 'react'; // <-- Added useContext
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- Added useNavigate
import { AuthContext } from '../context/AuthContext';
import API from '../api';

function Login() {
  const { login } = useContext(AuthContext); // <-- Extract login function from Context
  const navigate = useNavigate(); // <-- Initialize navigate function

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to your Express server's login route
      const response = await API.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      // Backend success
      setIsError(false);
      setStatusMessage(response.data.message); // Displays "Login successful!"
      
      // <-- USE THE CONTEXT LOGIN FUNCTION! (Saves token and user data globally)
      login(response.data.token, response.data.user);
      
      // Clear the form
      setFormData({ email: '', password: '' });

      // <-- Redirect to Home page after a short delay (1.5 seconds)
      setTimeout(() => {
        navigate('/home'); 
      }, 1500);

    } catch (error) {
      // Backend error (e.g., Invalid credentials, User not found)
      setIsError(true);
      setStatusMessage(
        error.response && error.response.data.message 
        ? error.response.data.message 
        : "An error occurred connecting to the server."
      );
    }
  };

  return (
    <main className="page">
      <section className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2>Welcome Back</h2>
        <p>Log in to access your dashboard and manage your posts.</p>
        
        {/* Status Message Display */}
        {statusMessage && (
          <div style={{ 
            padding: '10px', marginBottom: '15px', borderRadius: '5px',
            backgroundColor: isError ? '#ffe6e6' : '#e6ffe6',
            color: isError ? 'red' : 'green',
            border: `1px solid ${isError ? 'red' : 'green'}`
          }}>
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="example@mail.com" 
                   value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter your password"
                   value={formData.password} onChange={handleChange} required />
          </div>

          <button className="btn" type="submit" style={{ width: '100%', marginTop: '10px' }}>
            Log In
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;