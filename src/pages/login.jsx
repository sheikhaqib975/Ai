import React, { useState } from 'react';
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');

  // Custom SVG Icons
  const Icons = {
    Stethoscope: () => (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
        <circle cx="20" cy="10" r="2"/>
      </svg>
    ),
    Mail: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    Lock: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    Eye: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    EyeOff: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>
    ),
    AlertCircle: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    CheckCircle: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    Google: () => (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
    X: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    )
  };

  const customStyles = {
    container: {
      minHeight: '100vh',
      background: 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    loginCard: {
      backgroundColor: 'rgba(26, 26, 46, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '24px',
      padding: '48px',
      maxWidth: '480px',
      width: '100%',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
    },
    iconBox: {
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.3))',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      borderRadius: '20px',
      width: '80px',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#10b981',
      margin: '0 auto 24px'
    },
    inputGroup: {
      position: 'relative',
      marginBottom: '24px'
    },
    input: {
      width: '100%',
      padding: '14px 16px 14px 48px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      color: '#ffffff',
      fontSize: '15px',
      transition: 'all 0.3s ease',
      outline: 'none'
    },
    inputIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#10b981',
      pointerEvents: 'none'
    },
    eyeIcon: {
      position: 'absolute',
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#10b981',
      cursor: 'pointer',
      padding: '4px'
    },
    emeraldBtn: {
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(45deg, #10b981, #059669)',
      border: 'none',
      borderRadius: '12px',
      color: '#ffffff',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
    },
    googleBtn: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#ffffff',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      color: '#333333',
      fontSize: '15px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    },
    errorText: {
      color: '#ef4444',
      fontSize: '13px',
      marginTop: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    successText: {
      color: '#10b981',
      fontSize: '13px',
      marginTop: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
      margin: '24px 0',
      color: 'rgba(255, 255, 255, 0.4)'
    },
    link: {
      color: '#10b981',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'color 0.3s ease',
      cursor: 'pointer'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'rgba(26, 26, 46, 0.98)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      padding: '32px',
      maxWidth: '450px',
      width: '90%',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save user data to Firestore
  const saveUserToFirestore = async (user) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL || null,
        lastLogin: serverTimestamp(),
        loginCount: userDoc.exists() ? (userDoc.data().loginCount || 0) + 1 : 1,
        ...(userDoc.exists() && {
          createdAt: userDoc.data().createdAt,
        }),
        ...(!userDoc.exists() && {
          createdAt: serverTimestamp(),
        }),
      }, { merge: true });

      console.log('User data saved to Firestore');
    } catch (error) {
      console.error('Error saving to Firestore:', error);
    }
  };

  // FIXED: Password Reset with better error handling and logging
  const handlePasswordReset = async () => {
    setResetError('');
    setResetSuccess(false);

    if (!resetEmail) {
      setResetError('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔄 Attempting to send password reset email to:', resetEmail);
      console.log('📧 Auth instance check:', auth ? '✅ Auth initialized' : '❌ Auth not initialized');
      
      // Send password reset email with action code settings
      await sendPasswordResetEmail(auth, resetEmail, {
        url: window.location.origin + '/login',
        handleCodeInApp: false
      });
      
      console.log('✅ Password reset email sent successfully!');
      setResetSuccess(true);
      
      // Close modal after 3 seconds
      setTimeout(() => {
        setShowResetModal(false);
        setResetEmail('');
        setResetSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('❌ Password reset error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error:', JSON.stringify(error, null, 2));

      let errorMessage = 'Failed to send reset email';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please check your email or sign up.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many reset attempts. Please try again in a few minutes';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection';
          break;
        case 'auth/missing-android-pkg-name':
        case 'auth/missing-ios-bundle-id':
        case 'auth/invalid-continue-uri':
          errorMessage = 'App configuration error. Please contact support';
          console.error('⚠️ Configuration issue detected. Check Firebase authorized domains.');
          break;
        case 'auth/unauthorized-continue-uri':
          errorMessage = 'Domain not authorized. Please contact support';
          console.error('⚠️ Domain not in Firebase authorized domains list');
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Password reset is not enabled. Please contact support';
          console.error('⚠️ Email/Password authentication not enabled in Firebase Console');
          break;
        default:
          errorMessage = error.message || 'Failed to send reset email. Please try again';
      }

      setResetError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log('Google sign-in successful:', user);

      await saveUserToFirestore(user);
      navigate('/home');

    } catch (error) {
      console.error('Google sign-in error:', error);

      let errorMessage = 'Failed to sign in with Google';

      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-in popup was closed';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Sign-in was cancelled';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup was blocked by browser';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
        default:
          errorMessage = error.message || 'Failed to sign in with Google';
      }

      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Email/Password Sign In
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;
      console.log('Login successful:', user);
      
      await saveUserToFirestore(user);
      navigate('/home');
      
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'An error occurred during login';
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          setErrors({ email: errorMessage });
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          setErrors({ email: errorMessage });
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please sign up first.';
          setErrors({ email: errorMessage });
          setTimeout(() => {
            navigate('/signup');
          }, 2000);
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          setErrors({ password: errorMessage });
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password. Please check your credentials or sign up.';
          setErrors({ password: errorMessage });
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          setErrors({ password: errorMessage });
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          setErrors({ password: errorMessage });
          break;
        default:
          errorMessage = error.message || 'Failed to login';
          setErrors({ password: errorMessage });
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={customStyles.container}>
      <div style={customStyles.loginCard}>
        <div style={customStyles.iconBox}>
          <Icons.Stethoscope />
        </div>

        <div style={{textAlign: 'center', marginBottom: '32px'}}>
          <h2 style={{color: '#ffffff', fontWeight: 'bold', marginBottom: '8px', fontSize: '28px'}}>Welcome Back</h2>
          <p style={{color: 'rgba(255, 255, 255, 0.6)', fontSize: '15px', margin: 0}}>
            Sign in to access your AI Health Assistant
          </p>
        </div>

        {errors.general && (
          <div style={{
            ...customStyles.errorText,
            marginBottom: '20px',
            padding: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '8px',
            justifyContent: 'center'
          }}>
            <Icons.AlertCircle />
            {errors.general}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          style={customStyles.googleBtn}
          disabled={isLoading}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.target.style.backgroundColor = '#f8f9fa';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#ffffff';
            e.target.style.boxShadow = 'none';
          }}
        >
          <Icons.Google />
          Continue with Google
        </button>

        <div style={customStyles.divider}>
          <div style={{flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)'}} />
          <span style={{padding: '0 16px', fontSize: '14px'}}>OR</span>
          <div style={{flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)'}} />
        </div>

        <div>
          <div style={customStyles.inputGroup}>
            <div style={customStyles.inputIcon}>
              <Icons.Mail />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              style={{
                ...customStyles.input,
                borderColor: errors.email ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'
              }}
            />
            {errors.email && (
              <div style={customStyles.errorText}>
                <Icons.AlertCircle />
                {errors.email}
              </div>
            )}
          </div>

          <div style={customStyles.inputGroup}>
            <div style={customStyles.inputIcon}>
              <Icons.Lock />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={{
                ...customStyles.input,
                borderColor: errors.password ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
                paddingRight: '48px'
              }}
            />
            <div 
              style={customStyles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
            </div>
            {errors.password && (
              <div style={customStyles.errorText}>
                <Icons.AlertCircle />
                {errors.password}
              </div>
            )}
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
            <label style={{display: 'flex', alignItems: 'center', color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', cursor: 'pointer'}}>
              <input 
                type="checkbox" 
                style={{marginRight: '8px', accentColor: '#10b981', cursor: 'pointer'}}
              />
              Remember me
            </label>
            <span 
              style={customStyles.link}
              onClick={() => setShowResetModal(true)}
            >
              Forgot password?
            </span>
          </div>

          <button
            onClick={handleSubmit}
            style={customStyles.emeraldBtn}
            disabled={isLoading}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
            }}
          >
            {isLoading ? (
              <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <span style={{
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid #ffffff',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  animation: 'spin 0.8s linear infinite',
                  marginRight: '8px',
                  display: 'inline-block'
                }} />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </div>

        <div style={{textAlign: 'center', marginTop: '24px'}}>
          <p style={{color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginBottom: '0'}}>
            Don't have an account?{' '}
            <span style={customStyles.link} onClick={() => navigate('/signup')}>
              Sign up for free
            </span>
          </p>
        </div>

        {/* <div style={{
          marginTop: '24px',
          padding: '12px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px'
        }}>
          <p style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', marginBottom: '0', textAlign: 'center'}}>
            This AI assistant is for informational purposes only and is not a substitute for professional medical advice.
          </p>
        </div> */}
      </div>

      {/* Password Reset Modal - FIXED VERSION */}
      {showResetModal && (
        <div style={customStyles.modalOverlay} onClick={() => !isLoading && setShowResetModal(false)}>
          <div style={customStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h3 style={{color: '#ffffff', margin: 0}}>Reset Password</h3>
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setResetEmail('');
                  setResetError('');
                  setResetSuccess(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                disabled={isLoading}
              >
                <Icons.X />
              </button>
            </div>

            <p style={{color: 'rgba(255, 255, 255, 0.7)', marginBottom: '24px', fontSize: '14px'}}>
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {resetSuccess ? (
              <div style={{
                ...customStyles.successText,
                padding: '16px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                justifyContent: 'center',
                fontSize: '15px'
              }}>
                <Icons.CheckCircle />
                <span>Password reset email sent! Check your inbox (and spam folder).</span>
              </div>
            ) : (
              <>
                <div style={{...customStyles.inputGroup, marginBottom: '16px'}}>
                  <div style={customStyles.inputIcon}>
                    <Icons.Mail />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) => {
                      setResetEmail(e.target.value);
                      setResetError('');
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !isLoading) {
                        handlePasswordReset();
                      }
                    }}
                    style={{
                      ...customStyles.input,
                      borderColor: resetError ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'
                    }}
                    disabled={isLoading}
                  />
                  {resetError && (
                    <div style={customStyles.errorText}>
                      <Icons.AlertCircle />
                      {resetError}
                    </div>
                  )}
                </div>

                <button
                  onClick={handlePasswordReset}
                  style={customStyles.emeraldBtn}
                  disabled={isLoading}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
                  }}
                >
                  {isLoading ? (
                    <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <span style={{
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderTop: '2px solid #ffffff',
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        animation: 'spin 0.8s linear infinite',
                        marginRight: '8px',
                        display: 'inline-block'
                      }} />
                      Sending...
                    </span>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>

                <p style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '12px',
                  marginTop: '16px',
                  textAlign: 'center',
                  lineHeight: '1.5'
                }}>
                  Make sure the email is registered. Check your spam folder if you don't see the email within a few minutes.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #0a0a0f;
        }

        input:focus {
          border-color: #10b981 !important;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        ::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
};

export default Login;