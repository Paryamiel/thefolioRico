import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 

function Navbar() {
  const { user, logout } = useContext(AuthContext); 
  const navigate = useNavigate();

  const toggleTheme = () => {
    const doc = document.documentElement;
    const current = doc.getAttribute('data-theme');
    const target = current === 'dark' ? 'light' : 'dark';
    doc.setAttribute('data-theme', target);
    localStorage.setItem('theme', target);
  };

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  return (
    <header className="site-header">
      <div className="brand"><h1>RKB Portfolio</h1></div>
      <nav>
        <Link className="nav-link" to="/home">Home</Link>
        <Link className="nav-link" to="/about">About</Link>
        <Link className="nav-link" to="/contact">Contact</Link>
        <Link className="nav-link" to="/community">Community</Link>
        
        {/* --- CONDITIONAL RENDERING --- */}
        {user ? (
          <>
            {/* Admin Dashboard Link - Only shows for Admins */}
            {user.role === 'admin' && (
              <Link className="nav-link" to="/admin" style={{ color: 'var(--green, #4CAF50)', fontWeight: 'bold' }}>
                Admin Dashboard
              </Link>
            )}
            
            {/* Changed user.fullname to user.name to match our database updates! */}
            <Link className="nav-link" to="/profile">Profile ({user.name})</Link>
            
            <button className="btn" onClick={handleLogout} style={{ marginLeft: '10px', backgroundColor: '#ff4d4d', color: 'white', border: 'none' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/register">Register</Link>
            <Link className="nav-link" to="/login">Login</Link>
          </>
        )}

        <button className="btn" onClick={toggleTheme} style={{ marginLeft: '10px' }}>🌓 Mode</button>
      </nav>
    </header>
  );
}

export default Navbar;