import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; // Make sure the path is correct

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const storedUsername = 'Waiz';
    const storedPassword =  'Waiz92';
    if (username === storedUsername && password === storedPassword) {
      onLogin();
      navigate('/');
    } else {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000); // Hide the alert after 3 seconds
    }
  };

  return (
    <div className="login-form-container">
      <div className="background-text">Maher Dairy Farm</div> {/* Background text */}
      <div className="login-form-card">
        {showAlert && (
          <div className="alert-message show">
            Incorrect username or password!
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
