import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function PostCard({ post, handleDelete }) {
  const { user } = useContext(AuthContext);

  // State for Comments
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  // Check if the current user is the author of the post
  const isAuthor = user && post.author && (post.author._id === user._id || post.author === user._id);

  // Fetch comments when the user opens the comment section
  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/comments/${post._id}`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleToggleComments = () => {
    if (!showComments) {
      fetchComments(); // Only fetch when opening the section
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/comments',
        { text: newComment, postId: post._id },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      // Add the new comment directly to the UI so it shows up instantly!
      setComments([...comments, response.data.comment]);
      setNewComment(''); // Clear the input field
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Remove the comment from the UI
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment.");
    }
  };

  return (
    <div className="card" style={{ marginBottom: '20px', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      {/* Post Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {post.author && post.author.profilePicture ? (
            <img 
              src={post.author.profilePicture.startsWith('/') ? `http://localhost:5000${post.author.profilePicture}` : `http://localhost:5000/${post.author.profilePicture}`} 
              alt="Author" 
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ccc' }}></div>
          )}
          <strong>{post.author && post.author.name ? post.author.name : 'Unknown User'}</strong>
        </div>
        <small style={{ color: '#666' }}>{new Date(post.createdAt).toLocaleDateString()}</small>
      </div>

      {/* Post Content */}
      <h3 style={{ marginTop: '0', color: 'var(--primary-color)' }}>{post.title}</h3>
      <p style={{ lineHeight: '1.6' }}>{post.description}</p>

      {/* Post Image */}
      {post.image && (
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <img 
            src={post.image.startsWith('/') ? `http://localhost:5000${post.image}` : `http://localhost:5000/${post.image}`} 
            alt="Post" 
            style={{ maxWidth: '100%', borderRadius: '8px', maxHeight: '400px', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Post Action Buttons */}
      <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '15px' }}>
        <button 
          onClick={handleToggleComments}
          style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {showComments ? 'Hide Comments' : 'View Comments'}
        </button>

        {isAuthor && (
          <button 
            onClick={() => handleDelete(post._id)}
            style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9em' }}
          >
            Delete Post
          </button>
        )}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div style={{ marginTop: '15px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
          
          {/* Add Comment Form */}
          {user ? (
            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input 
                type="text" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..." 
                style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              />
              <button type="submit" className="btn" style={{ padding: '10px 15px' }}>Post</button>
            </form>
          ) : (
            <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '20px' }}>Log in to leave a comment.</p>
          )}

          {/* List of Comments */}
          {isLoadingComments ? (
            <p style={{ textAlign: 'center', color: '#666' }}>Loading comments...</p>
          ) : comments.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9em' }}>No comments yet. Be the first!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {comments.map(comment => {
                const isCommentAuthor = user && comment.author && (comment.author._id === user._id || comment.author === user._id);
                
                return (
                  <div key={comment._id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    {/* Comment Author Pic */}
                    {comment.author && comment.author.profilePicture ? (
                      <img 
                        src={comment.author.profilePicture.startsWith('/') ? `http://localhost:5000${comment.author.profilePicture}` : `http://localhost:5000/${comment.author.profilePicture}`} 
                        alt="Author" 
                        style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#ccc' }}></div>
                    )}
                    
                    {/* Comment Content */}
                    <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px', border: '1px solid #eee', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <strong style={{ fontSize: '0.9em' }}>{comment.author && comment.author.name ? comment.author.name : 'Unknown User'}</strong>
                        
                        {/* Delete Comment Button */}
                        {(isCommentAuthor || (user && user.role === 'Admin')) && (
                          <button 
                            onClick={() => handleDeleteComment(comment._id)}
                            style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '0.8em' }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.95em' }}>{comment.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PostCard;