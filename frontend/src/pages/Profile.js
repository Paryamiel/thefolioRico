import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Profile() {
  const { user, login } = useContext(AuthContext); 

  const [formData, setFormData] = useState({
    name: '', // Changed to name
    bio: ''
  });
  
  const [file, setFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '', // Changed to name
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = new FormData();
    updateData.append('name', formData.name); // Changed to name
    updateData.append('bio', formData.bio);
    if (file) {
      updateData.append('profilePicture', file); // Changed to profilePicture
    }

    try {
      const token = localStorage.getItem('token'); 
      
      const response = await axios.put('http://localhost:5000/api/auth/profile', updateData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        }
      });

      setIsError(false);
      setStatusMessage('Profile updated successfully!');
      
      login(token, response.data.user);

      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      setIsError(true);
      setStatusMessage(
        error.response && error.response.data.message 
        ? error.response.data.message 
        : "An error occurred while updating your profile."
      );
    }
  };

  if (!user) {
    return (
      <main className="page">
        <section className="card" style={{ textAlign: 'center' }}>
          <h2>Access Denied</h2>
          <p>Please log in to view your profile.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>My Profile</h2>
        
        {/* Profile Picture Display */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          {/* Changed to profilePicture */}
          {user.profilePicture ? (
            <img 
              src={user.profilePicture.startsWith('/') 
                ? `http://localhost:5000${user.profilePicture}` 
                : `http://localhost:5000/${user.profilePicture}`} 
              alt="Profile" 
              style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--green)' }} 
            />
          ) : (
            <div style={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#ccc', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span>No Image</span>
            </div>
          )}
        </div>

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

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Name</label>
            {/* Changed name attribute to 'name' */}
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label>Bio</label>
            <textarea name="bio" rows="4" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself..."></textarea>
          </div>

          <div className="form-row">
            <label>Profile Picture</label>
            {/* Changed name attribute to 'profilePicture' */}
            <input type="file" name="profilePicture" accept="image/*" onChange={handleFileChange} style={{ padding: '5px' }} />
          </div>

          <button className="btn" type="submit" style={{ width: '100%' }}>Save Changes</button>
        </form>
      </section>
    </main>
  );
}

export default Profile;