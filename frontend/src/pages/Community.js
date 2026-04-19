import React, { useState, useEffect, useContext } from 'react';
import PostCard from '../components/PostCard';
import { AuthContext } from '../context/AuthContext';
import API from '../api';

function Community() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

  const fetchPosts = async () => {
    try {
      const response = await API.get('/posts');
      setPosts(response.data); 
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage("You must be logged in to post.");
      return;
    }

    const postData = new FormData();
    postData.append('title', formData.title);
    postData.append('description', formData.description);
    if (imageFile) {
      postData.append('image', imageFile);
    }

    try {
      await API.post('/posts', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      setFormData({ title: '', description: '' });
      setImageFile(null);
      
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

      setMessage("Post created successfully!");
      fetchPosts(); 
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error creating post:", error);
      setMessage(error.response?.data?.message || "Failed to create post.");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await API.delete(`/posts/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    }
  };

  return (
    <main className="page" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Community Board</h1>

      {user ? (
        <section className="card" style={{ marginBottom: '30px', padding: '20px' }}>
          <h3>Create a New Post</h3>
          {message && <div style={{ color: message.includes('success') ? 'green' : 'red', marginBottom: '10px' }}>{message}</div>}
          
          <form onSubmit={handleCreatePost}>
            <div className="form-row" style={{ marginBottom: '10px' }}>
              <input 
                type="text" 
                name="title" 
                placeholder="Post Title" 
                value={formData.title} 
                onChange={handleInputChange} 
                required 
                style={{ width: '100%', padding: '10px' }}
              />
            </div>
            <div className="form-row" style={{ marginBottom: '10px' }}>
              <textarea 
                name="description" 
                placeholder="What's on your mind?" 
                rows="3" 
                value={formData.description} 
                onChange={handleInputChange} 
                required
                style={{ width: '100%', padding: '10px' }}
              ></textarea>
            </div>
            
            {user.role === 'Admin' && (
              <div className="form-row" style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '0.9em', color: '#555' }}>Attach an Image (Admin Only):</label><br/>
                <input 
                  type="file" 
                  name="image" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
              </div>
            )}

            <button className="btn" type="submit">Post to Community</button>
          </form>
        </section>
      ) : (
        <div className="card" style={{ marginBottom: '30px', padding: '20px', textAlign: 'center' }}>
          <p>Please log in to create a post.</p>
        </div>
      )}

      <section>
        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>No posts yet. Be the first to say hello!</p>
        ) : (
          posts.map(post => (
            <PostCard 
              key={post._id} 
              post={post} 
              handleDelete={handleDeletePost} 
            />
          ))
        )}
      </section>
    </main>
  );
}

export default Community;