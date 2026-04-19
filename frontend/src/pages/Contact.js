import React, { useState } from 'react';
import axios from 'axios'; // <-- 1. Import axios to talk to the backend
import API from '../api'; // <-- 2. Import our custom API module for cleaner requests

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
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

  // 2. Make this function async so we can await the backend response
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!formData.name || !formData.email || !formData.message) {
      setIsError(true);
      setStatusMessage('Please fill out all fields before submitting.');
      return;
    }

    try {
      // 3. Send the actual data to our backend database!
      await API.post('/contacts', formData);

      // If successful:
      setIsError(false);
      setStatusMessage('Message sent successfully!');
      
      // Clear the form
      setFormData({ name: '', email: '', message: '' });
      
      // Hide the success message after 3 seconds
      setTimeout(() => setStatusMessage(''), 3000);

    } catch (error) {
      // Handle any backend errors
      setIsError(true);
      setStatusMessage(error.response?.data?.message || 'Failed to send message. Try again later.');
    }
  };

  return (
    <main className="page">
      <section className="card">
        <h2>Contact & Resources</h2>
        <p>Connect with me or find helpful links below.</p>
        
        <h3>Useful Resources</h3>
        <table>
          <thead>
            <tr><th>Resource Name</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><a href="https://color.adobe.com" target="_blank" rel="noreferrer">Adobe Color</a></td>
              <td>Color palette generator for artists.</td>
            </tr>
            <tr>
              <td><a href="https://developer.mozilla.org" target="_blank" rel="noreferrer">MDN Web Docs</a></td>
              <td>Guide for HTML/CSS learning.</td>
            </tr>
            <tr>
              <td><a href="https://www.artstation.com" target="_blank" rel="noreferrer">ArtStation</a></td>
              <td>Portfolio inspiration site.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="card">
        <h3>Send a Message</h3>
        
        {/* Conditionally render the status message */}
        {statusMessage && (
          <div style={{ 
            padding: '10px', 
            marginBottom: '15px', 
            borderRadius: '5px',
            backgroundColor: isError ? '#ffe6e6' : '#e6ffe6',
            color: isError ? 'red' : 'green',
            border: `1px solid ${isError ? 'red' : 'green'}`
          }}>
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Name</label>
            <input 
              type="text" 
              name="name"
              placeholder="Your Name" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-row">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              placeholder="email@example.com" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-row">
            <label>Message</label>
            <textarea 
              name="message"
              rows="5" 
              placeholder="Type here..." 
              value={formData.message}
              onChange={handleChange}
              required 
            ></textarea>
          </div>
          <button className="btn" type="submit">Submit</button>
        </form>
      </section>

      <section className="card">
        <h3>Our Location</h3>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.123456!2d120.4!3d16.0!2m3!1f0!2f0!3f0!..." 
          title="Google Maps Location"
          width="100%" 
          height="300" 
          style={{ border: 0, borderRadius: '8px' }} 
          allowFullScreen="" 
          loading="lazy"
        ></iframe>
      </section>
    </main>
  );
}

export default Contact;