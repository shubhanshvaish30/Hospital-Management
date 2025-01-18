import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HospitalLocator from './pages/HospitalLocator';
import HealthRecords from './pages/HealthRecords';
import Appointments from './pages/Appointments';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';

function App() {
  const [authToken, setAuthToken] = useState(null);
  const [googleClientId,setGoogleClientId]=useState("")
  async function getGoogleClientId() {
    try {
      const { data } = await axios.get(`https://hospital-management-3tyt.onrender.com/auth/getClientId`);
      
      setGoogleClientId(data.clientId);
    } catch (error) {
      console.error('Error fetching Google Client Id: ', error);
    }
  }
  
  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
    getGoogleClientId();

  }, [localStorage.getItem('authToken')]);
  console.log(authToken);
  

  // Wrapper for Google login with OAuth provider
  const GoogleAuthWrapper = () => {
    return (
      <GoogleOAuthProvider clientId={googleClientId}>
        <Login />
      </GoogleOAuthProvider>
    );
  };

  // ProtectedRoute component to protect certain routes
  const ProtectedRoute = ({ element }) => {
    console.log(authToken);
    
    return authToken ? element : <Navigate to="/login" />;
  };

  // Redirecting users to home if they are already logged in
  const LoginRedirect = () => {
    return authToken ? <Navigate to="/" /> : <GoogleAuthWrapper />;
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginRedirect />} /> {/* Redirect to Home if logged in */}

            {/* Protected Routes */}
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/hospitals" element={<ProtectedRoute element={<HospitalLocator />} />} />
            <Route path="/records" element={<ProtectedRoute element={<HealthRecords />} />} />
            <Route path="/appointments" element={<ProtectedRoute element={<Appointments />} />} />

            {/* Default Route - redirects to home if none of the routes match */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}

export default App;
