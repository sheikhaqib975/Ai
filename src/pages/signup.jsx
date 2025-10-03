import React, { useState } from 'react';
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Custom SVG Icons
  const Icons = {
    Stethoscope: () => (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
        <circle cx="20" cy="10" r="2"/>
      </svg>
    ),
    User: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
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
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
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
    signupCard: {
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
      marginBottom: '44px'
    },
    inputWrapper: {
      position: 'relative'
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
      pointerEvents: 'none',
      zIndex: 1
    },
    eyeIcon: {
      position: 'absolute',
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#10b981',
      cursor: 'pointer',
      padding: '4px',
      zIndex: 1
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
      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
      marginTop: '8px'
    },
    errorText: {
      color: '#ef4444',
      fontSize: '13px',
      position: 'absolute',
      bottom: '-30px',
      left: '0',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    successText: {
      color: '#10b981',
      fontSize: '13px',
      position: 'absolute',
      bottom: '-30px',
      left: '0',
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: formData.name.trim()
      });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: formData.name.trim(),
        email: formData.email,
        photoURL: null,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        loginCount: 1,
        emailVerified: false,
        role: 'user',
        preferences: {
          notifications: true,
          theme: 'dark'
        }
      });

      console.log('User registered and data saved to Firestore:', user);
      navigate('/home');
      
    } catch (error) {
      console.error('Signup error:', error);
      
      let errorMessage = 'An error occurred during signup';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered';
          setErrors({ email: errorMessage });
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          setErrors({ email: errorMessage });
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled';
          setErrors({ email: errorMessage });
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Use at least 6 characters';
          setErrors({ password: errorMessage });
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          setErrors({ email: errorMessage });
          break;
        default:
          errorMessage = error.message || 'Failed to create account';
          setErrors({ email: errorMessage });
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={customStyles.container}>
      <div style={customStyles.signupCard}>
        <div style={customStyles.iconBox}>
          <Icons.Stethoscope />
        </div>

        <div style={{textAlign: 'center', marginBottom: '32px'}}>
          <h2 style={{color: '#ffffff', fontWeight: 'bold', marginBottom: '8px', fontSize: '28px'}}>Create Account</h2>
          <p style={{color: 'rgba(255, 255, 255, 0.6)', fontSize: '15px', margin: 0}}>
            Join CareBot and get instant health guidance
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={customStyles.inputGroup}>
            <div style={customStyles.inputWrapper}>
              <div style={customStyles.inputIcon}>
                <Icons.User />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  ...customStyles.input,
                  borderColor: errors.name ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'
                }}
              />
            </div>
            {errors.name && (
              <div style={customStyles.errorText}>
                <Icons.AlertCircle />
                {errors.name}
              </div>
            )}
          </div>

          <div style={customStyles.inputGroup}>
            <div style={customStyles.inputWrapper}>
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
            </div>
            {errors.email && (
              <div style={customStyles.errorText}>
                <Icons.AlertCircle />
                {errors.email}
              </div>
            )}
          </div>

          <div style={customStyles.inputGroup}>
            <div style={customStyles.inputWrapper}>
              <div style={customStyles.inputIcon}>
                <Icons.Lock />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password (minimum 6 characters)"
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
            </div>
            {errors.password && (
              <div style={customStyles.errorText}>
                <Icons.AlertCircle />
                {errors.password}
              </div>
            )}
          </div>

          <div style={customStyles.inputGroup}>
            <div style={customStyles.inputWrapper}>
              <div style={customStyles.inputIcon}>
                <Icons.Lock />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{
                  ...customStyles.input,
                  borderColor: errors.confirmPassword ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
                  paddingRight: '48px'
                }}
              />
              <div 
                style={customStyles.eyeIcon}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <Icons.EyeOff /> : <Icons.Eye />}
              </div>
            </div>
            {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
              <div style={customStyles.successText}>
                <Icons.CheckCircle />
                Passwords match
              </div>
            )}
            {errors.confirmPassword && (
              <div style={customStyles.errorText}>
                <Icons.AlertCircle />
                {errors.confirmPassword}
              </div>
            )}
          </div>

          <button
            type="submit"
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
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div style={customStyles.divider}>
          <div style={{flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)'}} />
          <span style={{padding: '0 16px', fontSize: '14px'}}>OR</span>
          <div style={{flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)'}} />
        </div>

        <div style={{textAlign: 'center'}}>
          <p style={{color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginBottom: '0'}}>
            Already have an account?{' '}
            <span style={customStyles.link} onClick={() => navigate('/login')}>
              Sign in
            </span>
          </p>
        </div>

        <div style={{
          marginTop: '24px',
          padding: '12px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px'
        }}>
          <p style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', marginBottom: '0', textAlign: 'center'}}>
            By creating an account, you agree to our Terms of Service and Privacy Policy. This AI assistant is for informational purposes only.
          </p>
        </div>
      </div>

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

export default Signup