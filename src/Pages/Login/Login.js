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
     <div className="login-page">
       <div className={`container ${isRightPanelActive ? "right-panel-active" : ""}`}>
         <div className="form-container sign-in-container">
           {error && <div className="error-message">{error}</div>}
           <form onSubmit={handleLogin}>
             <input
               type="text"
               placeholder="Username"
               className="long-input"
               style={{ width: '300px' }}
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               required
             />
             <input
               type="password"
               placeholder="Password"
               className="long-input"
               style={{ width: '300px' }}
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
             />
             <button
                type="submit"
                className="sign-in-button"
                disabled={loading} // Disable button while loading
             >
               {loading ? "Logging in..." : "Log in"} {/* Show loading text */}
             </button>
           </form>
         </div>
          
         {/* Rest of the component remains the same */}
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
           <a href="" target="_blank" rel="noopener noreferrer">Mines and Geosciences Bureau</a>
         </p>
       </div>
     </div>
   );
};
 
export default Login;