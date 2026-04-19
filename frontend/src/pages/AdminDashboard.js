import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State to manage which tab is currently active
  const [activeTab, setActiveTab] = useState('users');

  // State to hold our data
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [contacts, setContacts] = useState([]);

  // Fetch data based on the active tab
  useEffect(() => {
    // Security redirect: Kick out anyone who isn't an Admin!
    if (!user || user.role !== 'Admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };

      try {
        if (activeTab === 'users') {
          const res = await API.get('/auth' , config);
          setUsers(res.data);
        } else if (activeTab === 'posts') {
          const res = await API.get('/posts');
          setPosts(res.data);
        } else if (activeTab === 'comments') {
          const res = await API.get('/comments', config);
          setComments(res.data);
        } else if (activeTab === 'contacts') {
          const res = await API.get('/contacts', config);
          setContacts(res.data);
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error);
      }
    };

    fetchData();
  }, [activeTab, user, navigate]);

  // --- DELETE HANDLERS ---
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this account?")) return;
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/auth/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsers(users.filter(u => u._id !== id));
    } catch (error) { alert("Error deleting user."); }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/posts/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setPosts(posts.filter(p => p._id !== id));
    } catch (error) { alert("Error deleting post."); }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/comments/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setComments(comments.filter(c => c._id !== id));
    } catch (error) { alert("Error deleting comment."); }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/contacts/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setContacts(contacts.filter(c => c._id !== id));
    } catch (error) { alert("Error deleting message."); }
  };

  // --- STYLES ---
  const tabStyle = { padding: '10px 20px', cursor: 'pointer', border: 'none', background: 'none', fontSize: '1.1em', fontWeight: 'bold' };
  const activeTabStyle = { ...tabStyle, borderBottom: '3px solid var(--primary-color)', color: 'var(--primary-color)' };
  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
  const thStyle = { textAlign: 'left', padding: '12px', borderBottom: '2px solid #ddd', backgroundColor: '#f9f9f9' };
  const tdStyle = { padding: '12px', borderBottom: '1px solid #ddd' };
  const delBtnStyle = { backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };

  return (
    <main className="page" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Welcome to the control panel, Admin.</p>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
        <button style={activeTab === 'users' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('users')}>Accounts</button>
        <button style={activeTab === 'posts' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('posts')}>Posts</button>
        <button style={activeTab === 'comments' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('comments')}>Comments</button>
        <button style={activeTab === 'contacts' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('contacts')}>Messages</button>
      </div>

      {/* Tab Content: USERS */}
      {activeTab === 'users' && (
        <div className="card" style={{ padding: '20px', overflowX: 'auto' }}>
          <h2>Manage Accounts</h2>
          <table style={tableStyle}>
            <thead><tr><th style={thStyle}>Name</th><th style={thStyle}>Email</th><th style={thStyle}>Role</th><th style={thStyle}>Action</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td style={tdStyle}>{u.name}</td>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}><strong>{u.role}</strong></td>
                  <td style={tdStyle}>
                    {u.role !== 'Admin' && <button style={delBtnStyle} onClick={() => handleDeleteUser(u._id)}>Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content: POSTS */}
      {activeTab === 'posts' && (
        <div className="card" style={{ padding: '20px', overflowX: 'auto' }}>
          <h2>Manage Posts</h2>
          <table style={tableStyle}>
            <thead><tr><th style={thStyle}>Title</th><th style={thStyle}>Author</th><th style={thStyle}>Date</th><th style={thStyle}>Action</th></tr></thead>
            <tbody>
              {posts.map(p => (
                <tr key={p._id}>
                  <td style={tdStyle}>{p.title}</td>
                  <td style={tdStyle}>{p.author?.name || 'Unknown'}</td>
                  <td style={tdStyle}>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td style={tdStyle}><button style={delBtnStyle} onClick={() => handleDeletePost(p._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content: COMMENTS */}
      {activeTab === 'comments' && (
        <div className="card" style={{ padding: '20px', overflowX: 'auto' }}>
          <h2>Manage Comments</h2>
          <table style={tableStyle}>
            <thead><tr><th style={thStyle}>Comment</th><th style={thStyle}>Author</th><th style={thStyle}>Posted On</th><th style={thStyle}>Action</th></tr></thead>
            <tbody>
              {comments.map(c => (
                <tr key={c._id}>
                  <td style={tdStyle}>"{c.text}"</td>
                  <td style={tdStyle}>{c.author?.name || 'Unknown'}</td>
                  <td style={tdStyle}>{c.post?.title || 'Deleted Post'}</td>
                  <td style={tdStyle}><button style={delBtnStyle} onClick={() => handleDeleteComment(c._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content: CONTACTS */}
      {activeTab === 'contacts' && (
        <div className="card" style={{ padding: '20px', overflowX: 'auto' }}>
          <h2>Contact Form Concerns</h2>
          {contacts.length === 0 ? <p>No messages right now.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {contacts.map(c => (
                <div key={c._id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <strong>{c.name} ({c.email})</strong>
                    <span style={{ color: '#666', fontSize: '0.9em' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ margin: '0 0 15px 0' }}>{c.message}</p>
                  <button style={delBtnStyle} onClick={() => handleDeleteContact(c._id)}>Mark as Resolved / Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default AdminDashboard;