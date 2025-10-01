import React, { useState, useRef, useEffect } from 'react';

const HealthAIAssistant = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { 
      type: 'bot', 
      message: "Hello! I'm your AI Health Assistant. Please describe your symptoms, and I'll help analyze them. Remember, I'm not a replacement for professional medical advice.",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const Icons = {
    Bot: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
        <circle cx="12" cy="5" r="2"/>
        <path d="M12 7v4"/>
        <line x1="8" y1="16" x2="8" y2="16"/>
        <line x1="16" y1="16" x2="16" y2="16"/>
      </svg>
    ),
    Brain: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
        <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
      </svg>
    ),
    Send: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22,2 15,22 11,13 2,9 22,2"/>
      </svg>
    ),
    User: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    Menu: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    ),
    X: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    ),
    AlertTriangle: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    Stethoscope: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
        <circle cx="20" cy="10" r="2"/>
      </svg>
    ),
    LogOut: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    )
  };

  const customStyles = {
    body: {
      backgroundColor: '#0a0a0f',
      color: '#ffffff',
      minHeight: '100vh'
    },
    navbar: {
      backgroundColor: 'rgba(10, 10, 15, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(16, 185, 129, 0.2)'
    },
    heroSection: {
      background: 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
      minHeight: '100vh',
      paddingTop: '120px'
    },
    emeraldBtn: {
      background: 'linear-gradient(45deg, #10b981, #059669)',
      border: 'none',
      color: '#ffffff',
      fontWeight: '600',
      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
    },
    chatWindow: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: '900px',
      height: '85vh',
      backgroundColor: 'rgba(10, 10, 15, 0.98)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      borderRadius: '24px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 999
    },
    chatHeader: {
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.2))',
      borderRadius: '24px 24px 0 0',
      padding: '20px 24px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    chatMessages: {
      flex: 1,
      overflowY: 'auto',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    botMessage: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      borderRadius: '20px 20px 20px 6px',
      padding: '16px 20px',
      maxWidth: '80%',
      alignSelf: 'flex-start'
    },
    userMessage: {
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '20px 20px 6px 20px',
      padding: '16px 20px',
      maxWidth: '80%',
      alignSelf: 'flex-end'
    },
    iconBox: {
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.3))',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      borderRadius: '20px',
      width: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#10b981'
    },
    authContainer: {
      backgroundColor: '#0a0a0f',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)'
    },
    authCard: {
      backgroundColor: 'rgba(26, 26, 46, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      borderRadius: '24px',
      padding: '48px',
      maxWidth: '480px',
      width: '90%'
    }
  };

  const callChatGPT = async (userMessage) => {
    // Replace with your actual OpenAI API key
    const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY_HERE';
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a compassionate medical AI assistant. Provide helpful health information while always emphasizing that you are not a replacement for professional medical advice. Be empathetic, clear, and concise. Always recommend seeking professional medical care when appropriate.'
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 800,
          temperature: 0.7
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error) {
      console.error('API Error:', error);
      return "I apologize, but I'm having trouble connecting right now. Please try again. If your symptoms are urgent, please seek immediate medical attention by calling emergency services.";
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isAnalyzing) return;

    const userMessage = { 
      type: 'user', 
      message: currentMessage,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    const messageToAnalyze = currentMessage;
    setCurrentMessage('');
    setIsAnalyzing(true);

    const response = await callChatGPT(messageToAnalyze);
    
    const botMessage = { 
      type: 'bot', 
      message: response,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setChatMessages(prev => [...prev, botMessage]);
    setIsAnalyzing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setShowLogin(true);
    setShowChatWindow(false);
  };

  const handleLogin = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser({ name: foundUser.name, email: foundUser.email });
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const handleSignup = (name, email, password) => {
    const userExists = users.find(u => u.email === email);
    if (userExists) {
      return { success: false, error: 'Email already registered' };
    }
    
    const newUser = { name, email, password };
    setUsers([...users, newUser]);
    setUser({ name, email });
    setIsAuthenticated(true);
    return { success: true };
  };

  if (!isAuthenticated) {
    return (
      <>
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
          rel="stylesheet" 
        />
        
        <div style={customStyles.authContainer}>
          <div style={customStyles.authCard}>
            <div className="text-center mb-5">
              <div style={{...customStyles.iconBox, width: '80px', height: '80px', margin: '0 auto 24px'}} className="mx-auto mb-4">
                <Icons.Stethoscope />
              </div>
              <h2 className="fw-bold text-light mb-2">{showLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <p className="text-secondary">{showLogin ? 'Sign in to access AI Health Assistant' : 'Join us to get started'}</p>
            </div>

            {showLogin ? (
              <LoginForm onLogin={handleLogin} onSwitchToSignup={() => setShowLogin(false)} />
            ) : (
              <SignupForm onSignup={handleSignup} onSwitchToLogin={() => setShowLogin(true)} />
            )}
          </div>
        </div>

        <style>{`
          .form-control:focus {
            box-shadow: 0 0 0 0.25rem rgba(16, 185, 129, 0.25);
            border-color: #10b981;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div style={customStyles.body}>
        <nav className="navbar navbar-expand-lg fixed-top" style={customStyles.navbar}>
          <div className="container">
            <div className="navbar-brand d-flex align-items-center">
              <div style={customStyles.iconBox} className="me-3">
                <Icons.Stethoscope />
              </div>
              <div>
                <span className="fw-bold fs-3">AI Health Assistant</span>
                <div style={{fontSize: '10px', color: '#10b981'}}>Powered by ChatGPT</div>
              </div>
            </div>
            
            <button 
              className="navbar-toggler border-0" 
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{color: '#ffffff'}}
            >
              {isMenuOpen ? <Icons.X /> : <Icons.Menu />}
            </button>

            <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
              <ul className="navbar-nav ms-auto me-4">
                <li className="nav-item">
                  <a className="nav-link text-light" href="#features">Features</a>
                </li>
              </ul>
              <div className="d-flex gap-2 align-items-center">
                <div className="d-flex align-items-center text-light me-3">
                  <Icons.User />
                  <span className="ms-2">{user?.name}</span>
                </div>
                <button 
                  className="btn btn-sm btn-outline-light"
                  onClick={handleLogout}
                >
                  <Icons.LogOut />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {showChatWindow && (
          <>
            <div style={customStyles.overlay} onClick={() => setShowChatWindow(false)} />
            <div style={customStyles.chatWindow}>
              <div style={customStyles.chatHeader}>
                <div className="d-flex align-items-center">
                  <Icons.Brain />
                  <div className="ms-3">
                    <h6 className="mb-0 fw-semibold">AI Health Assistant</h6>
                    <small className="text-secondary">
                      {isAnalyzing ? 'Analyzing your symptoms...' : 'Ready to help'}
                    </small>
                  </div>
                </div>
                <button 
                  className="btn btn-sm btn-outline-light"
                  onClick={() => setShowChatWindow(false)}
                >
                  <Icons.X />
                </button>
              </div>

              <div style={customStyles.chatMessages}>
                {chatMessages.map((msg, index) => (
                  <div key={index}>
                    {msg.type === 'bot' && (
                      <div style={customStyles.botMessage}>
                        <div className="d-flex align-items-start mb-2">
                          <Icons.Bot />
                          <span className="ms-2 fw-semibold small">AI Assistant</span>
                        </div>
                        <p className="mb-1" style={{whiteSpace: 'pre-line', lineHeight: '1.6'}}>{msg.message}</p>
                        <small className="text-secondary">{msg.timestamp}</small>
                      </div>
                    )}
                    
                    {msg.type === 'user' && (
                      <div style={customStyles.userMessage}>
                        <div className="d-flex align-items-start justify-content-end mb-2">
                          <span className="me-2 fw-semibold small">You</span>
                          <Icons.User />
                        </div>
                        <p className="mb-1">{msg.message}</p>
                        <small className="text-secondary">{msg.timestamp}</small>
                      </div>
                    )}
                  </div>
                ))}
                
                <div ref={chatEndRef} />
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '0 0 24px 24px',
                padding: '20px'
              }}>
                <div className="d-flex gap-3">
                  <textarea
                    className="form-control bg-transparent border-secondary text-light"
                    placeholder="Describe your symptoms or health concerns..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows="2"
                    style={{resize: 'none'}}
                    disabled={isAnalyzing}
                  />
                  <button
                    className="btn align-self-end"
                    style={customStyles.emeraldBtn}
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Analyzing...</span>
                      </div>
                    ) : (
                      <Icons.Send />
                    )}
                  </button>
                </div>
                <small className="text-secondary mt-2 d-block">
                  Press Enter to send. For emergencies, call emergency services immediately.
                </small>
              </div>
            </div>
          </>
        )}

        <section style={customStyles.heroSection}>
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <h1 className="display-1 fw-bold mb-4">
                  <span style={{
                    background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    AI Health Assistant
                  </span>
                </h1>
                
                <p className="lead mb-5 text-secondary fs-3">
                  Get instant health guidance powered by advanced AI. Describe your symptoms and receive thoughtful, evidence-based information.
                </p>

                <button 
                  className="btn btn-lg px-5 py-3 mb-5" 
                  style={customStyles.emeraldBtn}
                  onClick={() => setShowChatWindow(true)}
                >
                  <Icons.Brain />
                  <span className="ms-2">Start Consultation</span>
                </button>

                <div className="p-4" style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '2px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '16px'
                }}>
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <Icons.AlertTriangle />
                    <strong className="ms-2">Medical Disclaimer</strong>
                  </div>
                  <p className="mb-0 text-secondary small">
                    This AI assistant provides health information for educational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. For medical emergencies, call emergency services immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-4" style={{backgroundColor: '#0a0a0f', borderTop: '1px solid rgba(255, 255, 255, 0.1)'}}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6">
                <p className="text-secondary small mb-0">
                  © 2024 AI Health Assistant. For informational purposes only.
                </p>
              </div>
              <div className="col-md-6 text-md-end">
                <p className="text-secondary small mb-0">
                  Emergency? Call your local emergency services immediately
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        .form-control:focus {
          box-shadow: 0 0 0 0.25rem rgba(16, 185, 129, 0.25);
          border-color: #10b981;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.5);
          border-radius: 3px;
        }
        
        .btn:hover {
          transform: translateY(-2px);
          transition: transform 0.2s;
        }
      `}</style>
    </>
  );
};

const LoginForm = ({ onLogin, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = onLogin(formData.email, formData.password);
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <>
      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label text-light">Email Address</label>
          <input 
            type="email" 
            className="form-control form-control-lg bg-transparent border-secondary text-light" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="Enter your email"
            required 
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-light">Password</label>
          <input 
            type="password" 
            className="form-control form-control-lg bg-transparent border-secondary text-light" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            placeholder="Create a password"
            required 
          />
        </div>

        <div className="mb-4">
          <label className="form-label text-light">Confirm Password</label>
          <input 
            type="password" 
            className="form-control form-control-lg bg-transparent border-secondary text-light" 
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            placeholder="Confirm your password"
            required 
          />
        </div>

        <button 
          type="submit" 
          className="btn w-100 mb-4" 
          style={{
            background: 'linear-gradient(45deg, #10b981, #059669)',
            border: 'none',
            color: '#ffffff',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
            padding: '14px',
            fontSize: '16px'
          }}
        >
          Create Account
        </button>

        <p className="text-center text-light mb-0">
          Already have an account? {' '}
          <button 
            type="button"
            onClick={onSwitchToLogin}
            className="btn btn-link text-decoration-none"
            style={{color: '#10b981', padding: 0}}
          >
            Sign In
          </button>
        </p>
      </form>
    </>
  );
};

export default HealthAIAssistant;<div className="mb-4">
          <label className="form-label text-light">Password</label>
          <input 
            type="password" 
            className="form-control form-control-lg bg-transparent border-secondary text-light" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            placeholder="Enter your password"
            required 
          />
        </div>

        <button 
          type="submit" 
          className="btn w-100 mb-4" 
          style={{
            background: 'linear-gradient(45deg, #10b981, #059669)',
            border: 'none',
            color: '#ffffff',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
            padding: '14px',
            fontSize: '16px'
          }}
        >
          Sign In
        </button>

        <p className="text-center text-light mb-0">
          Don't have an account? {' '}
          <button 
            type="button"
            onClick={onSwitchToSignup}
            className="btn btn-link text-decoration-none"
            style={{color: '#10b981', padding: 0}}
          >
            Sign Up
          </button>
        </p>
      </form>
    </>
  );
};

const SignupForm = ({ onSignup, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const result = onSignup(formData.name, formData.email, formData.password);
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <>
      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label text-light">Full Name</label>
          <input 
            type="text" 
            className="form-control form-control-lg bg-transparent border-secondary text-light" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Enter your name"
            required 
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-light">Email Address</label>
          <input 
            type="email" 
            className="form-control form-control-lg bg-transparent border-secondary text-light" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="Enter your email"
            required 
          />
        </div>