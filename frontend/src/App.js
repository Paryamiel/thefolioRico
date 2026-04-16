import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Register from './pages/Register'; // <-- 1. Import Register
import Login from './pages/Login';
import Profile from './pages/Profile';
import Community from './pages/Community';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} /> {/* <-- 2. Add Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/community" element={<Community />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <footer><p>© 2026 Rico K. Biete. All Rights Reserved.</p></footer>
      </div>
    </Router>
  );
}

export default App;