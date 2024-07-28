import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import LoginForm from './LoginForm'; // Assuming LoginForm is in the same directory
import Home from './Home'; // Make sure the path to your Home component is correct
import ConsumersSales from './ConsumersDales'; // Adjust the path as needed
import RelativesKhata from './RelativesKhata'; // Adjust the path as needed
import ConsumerKhata from './ConsumerKhata'; // Adjust the path as needed
import Expenditure from './Expenditure'; // Adjust the path as needed
import Employee from './Employee'; // Adjust the path as needed
import Sales from './Sales'; // Adjust the path as needed

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (username, password) => {
    setIsLoggedIn(true);
  };

  // A component to protect your routes
  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      {isLoggedIn && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <ConsumersSales />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <RelativesKhata />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <ConsumerKhata />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenditure"
          element={
            <ProtectedRoute>
              <Expenditure />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee"
          element={
            <ProtectedRoute>
              <Employee />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <Sales />
            </ProtectedRoute>
          }
        />


      </Routes>


    </Router>
  );
}

export default App;
