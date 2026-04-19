import React, { useState } from 'react';
import axios from 'axios'; // <-- 1. Import axios for API requests
import API from '../api';

function Register() {
  // 1. Single state object for all form fields
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    level: 'beg', // Default to beginner
    terms: false
  });

  // State for messages and specific input errors (like red borders)
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // 2. Handle input changes dynamically
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      // If it's a checkbox, use 'checked' boolean, otherwise use the text 'value'
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 3. Handle Form Submission & Validation (Made async to talk to backend)
  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = {};
    let isValid = true;

    // Password Match Validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = true;
      isValid = false;
      setStatusMessage("Passwords do not match!");
      setIsError(true);
    }

    // Age 18+ Validation
    if (formData.dob && isValid) { // Only check age if passwords already match
      const dobDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const monthDiff = today.getMonth() - dobDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }

      if (age < 18) {
        errors.dob = true;
        isValid = false;
        setStatusMessage("You must be 18 years or older to register.");
        setIsError(true);
      }
    }

    setFieldErrors(errors);

    // If frontend validation passes, send data to the backend!
    if (isValid) {
      try {
        // Send POST request to your Express server
        const response = await API.post('/auth/register', {
          name: formData.fullname,
          email: formData.email,
          password: formData.password,
          role: 'Member' // Defaulting the role to Member
        });

        // Backend success
        setIsError(false);
        setStatusMessage(response.data.message); // Displays the backend success message
        setFieldErrors({});
        
        // Reset the form
        setFormData({
          fullname: '', email: '', password: '', confirmPassword: '',
          dob: '', level: 'beg', terms: false
        });

        // Hide the success message after 3 seconds
        setTimeout(() => setStatusMessage(''), 3000);

      } catch (error) {
        // Backend error (e.g., Email already exists)
        setIsError(true);
        setStatusMessage(
          error.response && error.response.data.message 
          ? error.response.data.message 
          : "An error occurred connecting to the server."
        );
      }
    }
  };

  return (
    <main className="page">
      <section className="card">
        <h2>Interest Sign-Up</h2>
        <p>Sign up to receive updates on my art and design projects.</p>
        
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
            <label>Full Name</label>
            <input type="text" name="fullname" placeholder="Full Name" 
                   value={formData.fullname} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="example@mail.com" 
                   value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label>Password</label>
            <input type="password" name="password" 
                   value={formData.password} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" 
                   className={fieldErrors.confirmPassword ? 'input-error' : ''}
                   value={formData.confirmPassword} onChange={handleChange} required />
          </div>
          
          <div className="form-row">
            <label>Date of Birth</label>
            <input type="date" name="dob" 
                   className={fieldErrors.dob ? 'input-error' : ''}
                   value={formData.dob} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <p><strong>Experience Level:</strong></p>
            <label style={{ fontWeight: 'normal', display: 'inline-block', marginRight: '15px' }}>
              <input type="radio" name="level" value="beg" 
                     checked={formData.level === 'beg'} onChange={handleChange} /> Beginner
            </label>
            <label style={{ fontWeight: 'normal', display: 'inline-block', marginRight: '15px' }}>
              <input type="radio" name="level" value="adv" 
                     checked={formData.level === 'adv'} onChange={handleChange} /> Advanced
            </label>
            <label style={{ fontWeight: 'normal', display: 'inline-block' }}>
              <input type="radio" name="level" value="exp" 
                     checked={formData.level === 'exp'} onChange={handleChange} /> Expert
            </label>
          </div>

          <div className="form-row" style={{ display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" name="terms" id="terms"
                   checked={formData.terms} onChange={handleChange} 
                   required style={{ width: 'auto', marginRight: '10px' }} />
            <label htmlFor="terms" style={{ margin: 0, fontWeight: 'normal' }}>I agree to the terms and conditions.</label>
          </div>

          <button className="btn" type="submit">Complete Registration</button>
        </form>
      </section>
    </main>
  );
}

export default Register;