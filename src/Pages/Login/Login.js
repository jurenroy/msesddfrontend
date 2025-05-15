import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../Services/LoginService";
import "./Login.css";

const Login = () => {
  const [isRightPanelActive] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    setError(""); // Reset error state
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate("/Admin"); // Redirect to dashboard on success
      } else {
        setError("Invalid username or password."); // Set error message
      }
    } catch (err) {
      setError("An error occurred during login. Please try again."); // Handle unexpected errors
    } finally {
      setLoading(false); // Set loading to false
    }
  };
  
  return (
    <div className="mgb-login mgb-login-page">
      <div className="mgb-login-container">
        <div className="mgb-login-card">
          <div className="mgb-login-brand">
            <div className="mgb-brand-logo"></div>
            <h1>MGB Login</h1>
            <p>Mines and Geosciences Bureau</p>
          </div>
          
          <div className="mgb-login-form-container">
            {error && <div className="mgb-error-message">{error}</div>}
            <h2>Welcome Back</h2>
            <p className="mgb-login-subtitle">Please enter your credentials to continue</p>
            
            <form onSubmit={handleLogin} className="mgb-login-form">
              <div className="mgb-input-group">
                <label htmlFor="username">Username</label>
                <div className="mgb-input-with-icon">
                  <span className="mgb-input-icon">👤</span>
                  <input
                    id="username"
                    type="text"
                    className="mgb-login-input"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="mgb-input-group">
                <label htmlFor="password">Password</label>
                <div className="mgb-input-with-icon">
                  <span className="mgb-input-icon">🔒</span>
                  <input
                    id="password"
                    type="password"
                    className="mgb-login-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              
              <button
                type="submit"
                className="mgb-login-button"
                disabled={loading}
              >
                {loading ? (
                  <span className="mgb-loading-spinner"></span>
                ) : (
                  "Log in"
                )}
              </button>
            </form>
          </div>
        </div>
        
        <div className="mgb-login-card-backdrop"></div>
      </div>
      
      <div className="mgb-login-footer">
        <p>
          <a href="#" target="_blank" rel="noopener noreferrer">Mines and Geosciences Bureau</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
