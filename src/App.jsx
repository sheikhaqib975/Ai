import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import Login from './pages/login';
import Signup from './pages/signup';
import HealthAIAssistant from './pages/homepage';


const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        setCurrentUser(user);
        
        // Fetch user data from Firestore
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            // Use auth data if Firestore document doesn't exist
            setUserData({
              displayName: user.displayName || user.email.split('@')[0],
              email: user.email,
              photoURL: user.photoURL
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Fallback to auth data
          setUserData({
            displayName: user.displayName || user.email.split('@')[0],
            email: user.email,
            photoURL: user.photoURL
          });
        }
      } else {
        // User is signed out
        setCurrentUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
        color: '#10b981'
      }}>
        <div style={{textAlign: 'center'}}>
          <div style={{
            border: '4px solid rgba(16, 185, 129, 0.2)',
            borderTop: '4px solid #10b981',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{fontSize: '18px', fontWeight: '500'}}>Loading...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            currentUser ? <Navigate to="/home" replace /> : <Login />
          } 
        />
        <Route 
          path="/signup" 
          element={
            currentUser ? <Navigate to="/home" replace /> : <Signup />
          } 
        />
        
        {/* Protected Route */}
        <Route 
          path="/home" 
          element={
            currentUser ? (
              <HealthAIAssistant user={userData} currentUser={currentUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/* Default Route */}
        <Route 
          path="/" 
          element={
            currentUser ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
          } 
        />
        
        {/* Catch all - redirect to login or home */}
        <Route 
          path="*" 
          element={
            currentUser ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;