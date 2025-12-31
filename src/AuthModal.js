import React, { useState } from 'react';
import { auth } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail 
} from 'firebase/auth';
import './AuthModal.css';

function AuthModal({ onClose }) {
  const [isSignup, setIsSignup] = useState(false); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // New state for success messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account Created Successfully! You are now logged in.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose(); 
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  // --- NEW: FORGOT PASSWORD FUNCTION ---
  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
      setError(""); // Clear any old errors
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
      setMessage("");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        
        <h2>{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
        
        {/* Show Error or Success Message */}
        {error && <p className="error-msg">{error}</p>}
        {message && <p style={{color:'green', fontSize:'14px', marginBottom:'10px'}}>{message}</p>}
        
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            className="auth-input" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          
          <input 
            type="password" 
            className="auth-input" 
            placeholder="Password (6+ chars)" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          
          <button type="submit" className="auth-btn">
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        {/* FORGOT PASSWORD LINK (Only show in Login mode) */}
        {!isSignup && (
          <p 
            onClick={handleResetPassword} 
            style={{
              color:'#007bff', 
              fontSize:'13px', 
              cursor:'pointer', 
              marginTop:'10px',
              textDecoration:'underline'
            }}
          >
            Forgot Password?
          </p>
        )}

        <p className="switch-mode" onClick={() => {
            setIsSignup(!isSignup);
            setError('');
            setMessage('');
          }}>
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <span>{isSignup ? 'Login' : 'Sign Up'}</span>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;