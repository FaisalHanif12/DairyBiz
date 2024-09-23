import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; // Importing CSS for styling

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState(''); // State for username
  const [password, setPassword] = useState(''); // State for password
  const [showAlert, setShowAlert] = useState(false); // State to manage alert visibility
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const storedUsername = 'Waiz'; // Stored username for comparison
    const storedPassword = 'Waiz92'; // Stored password for comparison
    console.log("Attempting to login with username:", username); // Console log the attempt
    if (username === storedUsername && password === storedPassword) {
      onLogin(); // Callback function on successful login
      navigate('/'); // Navigate to the home page
    } else {
      setShowAlert(true); // Show alert on failed login attempt
      setTimeout(() => setShowAlert(false), 3000); // Hide the alert after 3 seconds
    }
  };

  return (
    <div className="login-form-container">
      <div className="background-text">Maher Dairy Farm</div> {/* Background branding text */}
      <div className="login-form-card">
        {showAlert && (
          <div className="alert-message show">
            Incorrect username or password! {/* Alert message */}
          </div>
        )}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
