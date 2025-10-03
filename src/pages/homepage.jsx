import React, { useState } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import AIHealthChatBot from "./ai";

const HealthAIAssistant = ({ user, currentUser }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showChatWindow, setShowChatWindow] = useState(false);

  // Custom SVG Icons
  const Icons = {
    Stethoscope: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
        <circle cx="20" cy="10" r="2"/>
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
    Brain: () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="8" width="16" height="12" rx="2" />
    <path d="M12 2v6" />
    <circle cx="12" cy="2" r="1" />
    <path d="M8 12h0.01" />
    <path d="M16 12h0.01" />
    <path d="M9 16h6" />
    <path d="M4 16h-2" />
    <path d="M22 16h-2" />
  </svg>

    ),
    Zap: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
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
      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
      transition: 'all 0.3s ease'
    },
    featureCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
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
    }
  };

  const openChatWindow = () => {
    setShowChatWindow(true);
  };

  const closeChatWindow = () => {
    setShowChatWindow(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      {/* AI Chat Bot Component */}
      <AIHealthChatBot 
        isOpen={showChatWindow}
        onClose={closeChatWindow}
        userName={user?.displayName || 'User'}
      />
      
      <div style={customStyles.body}>
        {/* Navigation */}
        <nav className="navbar navbar-expand-lg fixed-top" style={customStyles.navbar}>
          <div className="container">
            <div className="navbar-brand d-flex align-items-center">
              <div style={customStyles.iconBox} className="me-3">
                <Icons.Stethoscope />
              </div>
              <div>
                <span className="fw-bold fs-3 text-white">CareBot</span>
                <div style={{ fontSize: '10px', color: '#10b981' }}>Smarter Health with AI</div>
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
                <li className="nav-item">
                  <a className="nav-link text-light" href="#about">About</a>
                </li>
              </ul>
              <div className="d-flex gap-2 align-items-center">
                <div className="d-flex align-items-center text-light me-3">
                  <Icons.User />
                  <span className="ms-2">Hello, {user?.displayName || 'User'}</span>
                </div>
                <button 
                  className="btn btn-sm btn-outline-light" 
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section style={customStyles.heroSection}>
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  {/* <Icons.Zap /> */}
                  {/* <span className="ms-2 text-warning small fw-semibold">Lightning Fast AI Responses</span> */}
                </div>
                
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
                  Get instant health guidance in seconds. Describe your symptoms and receive clear, evidence-based information tailored to you.
                </p>

                <button 
                  className="btn btn-lg px-5 py-3 mb-5" 
                  style={customStyles.emeraldBtn}
                  onClick={openChatWindow}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
                  }}
                >
                  <Icons.Brain />
                  <span className="ms-2">Start Consultation</span>
                </button>

                <div className="p-4" style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '2px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '16px'
                }}>
                  <div className="d-flex align-items-center justify-content-center">
                    <Icons.AlertTriangle />
                    <strong className="ms-2">Medical Disclaimer:</strong>
                  </div>
                  <p className="mb-0 mt-2 text-secondary">
                    This AI assistant provides health information for educational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. For medical emergencies, call emergency services immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-5" style={{backgroundColor: 'rgba(26, 26, 46, 0.5)'}}>
          <div className="container py-5">
            <div className="text-center mb-5">
              <h2 className="display-4 fw-bold mb-4">Why Choose CareBot?</h2>
              <p className="lead text-secondary">
                Experience instant, accurate health insights with advanced AI technology.
              </p>
            </div>

            <div className="row g-4">
              <div className="col-lg-4">
                <div className="p-4 h-100 text-center" style={customStyles.featureCard}>
                  <div style={{...customStyles.iconBox, margin: '0 auto 20px'}}>
                    <Icons.Zap />
                  </div>
                  <h5 className="fw-semibold mb-3">Lightning Fast</h5>
                  <p className="text-secondary">
                    Get instant responses in seconds — no more waiting for answers when you need them most.
                  </p>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="p-4 h-100 text-center" style={customStyles.featureCard}>
                  <div style={{...customStyles.iconBox, margin: '0 auto 20px'}}>
                    <Icons.Brain />
                  </div>
                  <h5 className="fw-semibold mb-3">Accurate Guidance</h5>
                  <p className="text-secondary">
                    Receive clear, evidence-based health information designed to support better decisions.
                  </p>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="p-4 h-100 text-center" style={customStyles.featureCard}>
                  <div style={{...customStyles.iconBox, margin: '0 auto 20px'}}>
                    <Icons.Stethoscope />
                  </div>
                  <h5 className="fw-semibold mb-3">Always Free</h5>
                  <p className="text-secondary">
                    Unlimited access without hidden costs — explore health insights anytime, anywhere.
                  </p>
                </div>
              </div>
            </div>
          </div>  
        </section>

        {/* About Section */}
        <section id="about" className="py-5">
          <div className="container py-5">
            <div className="row align-items-center">
              
              <div className="col-lg-6 mb-4 mb-lg-0">
                <h2 className="display-5 fw-bold mb-4">About CareBot</h2>
                <p className="text-secondary mb-4">
                  CareBot is designed to make reliable health information accessible to everyone, instantly. 
                  Describe your symptoms and receive clear, evidence-based guidance in just seconds — no long waits, no hidden costs.
                </p>
                <p className="text-secondary mb-4">
                  Conversations are processed securely, with a focus on delivering thoughtful, accurate, and easy-to-understand responses that support better decision-making for your health.
                </p>

                <div className="mb-4">
                  <h6 className="fw-semibold mb-2" style={{color: '#10b981'}}>Key Benefits:</h6>
                  <ul className="text-secondary">
                    <li>Instant responses in under a second</li>
                    <li>Unlimited daily requests</li>
                    <li>Completely free to use</li>
                    <li>No sign-up or credit card required</li>
                  </ul>
                </div>

                <button 
                  className="btn"
                  style={customStyles.emeraldBtn}
                  onClick={openChatWindow}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
                  }}
                >
                  Start Chatting Free
                </button>
              </div>
              
              <div className="col-lg-6">
                <div className="p-5 text-center" style={{
                  ...customStyles.featureCard,
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))'
                }}>
                  <Icons.Zap />
                  <h4 className="fw-bold mt-4 mb-3">Instant Health Guidance</h4>
                  <p className="text-secondary">
                    Access thoughtful, accurate health insights without delays, right when you need them.
                  </p>

                  <div className="mt-4 p-3" style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    <div className="d-flex justify-content-around text-center">
                      <div>
                        <div className="fs-3 fw-bold" style={{color: '#10b981'}}>{'<1s'}</div>
                        <small className="text-secondary">Response Time</small>
                      </div>
                      <div>
                        <div className="fs-3 fw-bold" style={{color: '#10b981'}}>Unlimited</div>
                        <small className="text-secondary">Daily Requests</small>
                      </div>
                      <div>
                        <div className="fs-3 fw-bold" style={{color: '#10b981'}}>$0</div>
                        <small className="text-secondary">Always Free</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-4" style={{backgroundColor: '#0a0a0f', borderTop: '1px solid rgba(255, 255, 255, 0.1)'}}>
          <div className="container">
            <div className="row align-items-center">
              
              <div className="col-md-6">
                <p className="text-secondary small mb-0">
                  © {new Date().getFullYear()} CareBot. For informational purposes only.
                </p>
              </div>
              
              <div className="col-md-6 text-md-end">
                <p className="text-secondary small mb-0">
                  {/* In an emergency, call your local emergency services immediately. */}
                </p>
              </div>
              
            </div>
          </div>
        </footer>

      </div>

      <style>{`
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
};

export default HealthAIAssistant;