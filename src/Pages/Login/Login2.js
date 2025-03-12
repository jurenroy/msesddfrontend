import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Login.css";

const Login = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize navigation

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh

    // Dummy login validation (Replace this with actual authentication logic)
    if (email === "MSES@gmail.com" && password === "MSES2025") {
      alert("Login successful!");
      navigate("/admin"); // Redirect to admin page
    } else {
      alert("Invalid email or passwordS.");
    }
  };

  return (
    <div className="login-page">
      <div className={`container ${isRightPanelActive ? "right-panel-active" : ""}`}>
        {/* Sign In Container */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleSubmit}> {/* Attach handleSubmit here */}
            <input
              type="email"
              placeholder="Email"
              className="long-input"
              style={{ width: '300px' }}
              value={email} // Controlled input
              onChange={(e) => setEmail(e.target.value)} // Update state
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="long-input"
              style={{ width: '300px' }}
              value={password} // Controlled input
              onChange={(e) => setPassword(e.target.value)} // Update state
              required
            />
            <a href="#">Forgot your password?</a>
            <button type="submit" className="sign-in-button">Log in</button> {/* Ensure it's a submit button */}
          </form>
        </div>

        {/* Overlay Container */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left"></div>
            <div className="overlay-panel overlay-right">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
            </div>
          </div>
        </div>
      </div>

      <div className="login-footer">
  <p>
    <a href="">Mines and Geosciences Bureau</a>
  </p>
</div>
</div>

  );
};

export default Login;
