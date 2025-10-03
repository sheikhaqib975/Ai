import React, { useState, useRef, useEffect } from 'react';

const AIHealthChatBot = ({ isOpen, onClose, userName }) => {
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

  // Prevent body scroll when chat is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Custom SVG Icons
  const Icons = {
    Bot: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
        <circle cx="12" cy="5" r="2"/>
        <path d="M12 7v4"/>
        <line x1="8" y1="16" x2="8" y2="16"/>
        <line x1="16" y1="16" x2="16" y2="16"/>
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
    Send: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22,2 15,22 11,13 2,9 22,2"/>
      </svg>
    ),
    User: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    X: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    ),
    Trash: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      </svg>
    )
  };

  // Backend API Configuration
  const API_BASE_URL = 'http://localhost:5000';

  // Call Backend API for health analysis
  const callBackendAPI = async (userMessage) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Backend API Error:', data);
        
        if (response.status === 503) {
          return "🌐 Service Unavailable\n\nUnable to reach the AI service. Please check:\n\n1. Your backend server is running (npm start)\n2. Server is accessible at http://localhost:5000\n3. Your internet connection is working\n\n⚠️ If symptoms are urgent, please call emergency services immediately.";
        }
        
        if (response.status === 500 && data.setup) {
          return `⚠️ Server Configuration Error\n\n${data.error}\n\n${data.setup}\n\nGet your FREE API key at: https://console.groq.com`;
        }
        
        if (response.status === 400) {
          return "❌ Invalid Request\n\nPlease make sure you've entered a valid message and try again.";
        }
        
        return `❌ Error: ${data.error || 'Unknown error occurred'}\n\n${data.details || ''}\n\n⚠️ For urgent medical issues, contact emergency services.`;
      }

      if (data.success && data.message) {
        return data.message;
      } else {
        throw new Error('Invalid API response format');
      }
      
    } catch (error) {
      console.error('API Error:', error);
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        return "🔌 Connection Error\n\nCannot connect to the backend server.\n\nPlease ensure:\n1. Backend server is running (run 'npm start' in backend folder)\n2. Server is running on http://localhost:5000\n3. No firewall blocking the connection\n\n⚠️ If symptoms are urgent, please call emergency services immediately.";
      }
      
      return `❌ Unexpected Error: ${error.message}\n\nPlease try again. If the problem persists, check that your backend server is running.\n\n⚠️ For urgent medical issues, contact emergency services.`;
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

    const response = await callBackendAPI(messageToAnalyze);
    
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

  const clearChat = () => {
    setChatMessages([
      { 
        type: 'bot', 
        message: "Hello! I'm your AI Health Assistant. Please describe your symptoms, and I'll help analyze them. Remember, I'm not a replacement for professional medical advice.",
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="chat-overlay" onClick={onClose}>
        <div className="chat-container" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="chat-header">
            <div className="header-content">
              <div className="header-icon">
                <Icons.Brain />
              </div>
              <div className="header-text">
                <h5 className="header-title">CareBot</h5>
                <small className="header-status">
                  {isAnalyzing ? '⚡ Analyzing...' : '✓ Ready to help'}
                </small>
              </div>
            </div>
            
            <div className="header-actions">
              <button className="icon-btn" onClick={clearChat} title="Clear chat">
                <Icons.Trash />
              </button>
              <button className="icon-btn" onClick={onClose} title="Close">
                <Icons.X />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {chatMessages.map((msg, index) => (
              <div key={index}>
                {msg.type === 'bot' && (
                  <div className="message bot-message">
                    <div className="message-header">
                      <Icons.Bot />
                      <span className="message-sender">AI Assistant</span>
                    </div>
                    <p className="message-text">{msg.message}</p>
                    <small className="message-time">{msg.timestamp}</small>
                  </div>
                )}
                
                {msg.type === 'user' && (
                  <div className="message user-message">
                    <div className="message-header user-header">
                      <span className="message-sender">{userName || 'You'}</span>
                      <Icons.User />
                    </div>
                    <p className="message-text">{msg.message}</p>
                    <small className="message-time">{msg.timestamp}</small>
                  </div>
                )}
              </div>
            ))}
            
            {isAnalyzing && (
              <div className="message bot-message">
                <div className="typing-indicator">
                  <Icons.Bot />
                  <span className="typing-text">AI Assistant is typing</span>
                  <div className="typing-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Input Section */}
          <div className="chat-input-section">
            <div className="input-wrapper">
              <textarea
                className="chat-textarea"
                placeholder="Describe your symptoms..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                rows="2"
                disabled={isAnalyzing}
              />
              <button
                className="send-btn"
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <div className="spinner" />
                    <span className="btn-text">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Icons.Send />
                    <span className="btn-text">Send</span>
                  </>
                )}
              </button>
            </div>
            <div className="disclaimer">
              <small>
                <strong>⚠️</strong> For educational purposes only. Not a substitute for professional medical advice. 
                For emergencies, call emergency services.
              </small>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .chat-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(10px);
          z-index: 9999;
          display: ${isOpen ? 'flex' : 'none'};
          align-items: center;
          justify-content: center;
          padding: 0;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .chat-container {
          width: 100%;
          height: 100vh;
          max-width: 1200px;
          max-height: 100%;
          background-color: rgba(10, 10, 15, 0.98);
          backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Desktop styles */
        @media (min-width: 768px) {
          .chat-overlay {
            padding: 12px;
          }

          .chat-container {
            max-width: 1200px;
            height: 85vh;
            border: 1px solid rgba(16, 185, 129, 0.3);
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          }
        }

        /* Header */
        .chat-header {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.2));
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }

        @media (min-width: 768px) {
          .chat-header {
            padding: 20px 28px;
          }
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }

        .header-icon {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.4));
          border: 1px solid rgba(16, 185, 129, 0.5);
          border-radius: 10px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #10b981;
          flex-shrink: 0;
        }

        @media (min-width: 768px) {
          .header-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
          }
        }

        .header-text {
          min-width: 0;
          flex: 1;
        }

        .header-title {
          margin: 0;
          font-weight: 600;
          color: #ffffff;
          font-size: 16px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (min-width: 768px) {
          .header-title {
            font-size: 18px;
          }
        }

        .header-status {
          color: rgba(255, 255, 255, 0.6);
          font-size: 11px;
          display: block;
        }

        @media (min-width: 768px) {
          .header-status {
            font-size: 13px;
          }
        }

        .header-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .icon-btn {
          padding: 8px;
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-btn:hover {
          background-color: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        @media (min-width: 768px) {
          .icon-btn {
            padding: 10px;
            border-radius: 10px;
          }
        }

        /* Messages */
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        @media (min-width: 768px) {
          .chat-messages {
            padding: 24px;
            gap: 20px;
          }
        }

        .message {
          padding: 14px 16px;
          border-radius: 16px;
          max-width: 90%;
          animation: messageSlide 0.3s ease-out;
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (min-width: 768px) {
          .message {
            padding: 18px 20px;
            border-radius: 20px;
            max-width: 75%;
          }
        }

        .bot-message {
          background-color: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 16px 16px 16px 6px;
          align-self: flex-start;
        }

        .user-message {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2));
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 16px 16px 6px 16px;
          align-self: flex-end;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .user-header {
          justify-content: flex-end;
        }

        .message-sender {
          font-weight: 600;
          font-size: 12px;
          color: #10b981;
        }

        @media (min-width: 768px) {
          .message-sender {
            font-size: 14px;
          }
        }

        .user-message .message-sender {
          color: #3b82f6;
        }

        .message-text {
          margin: 0 0 6px 0;
          color: #ffffff;
          line-height: 1.6;
          white-space: pre-line;
          font-size: 14px;
          word-wrap: break-word;
        }

        @media (min-width: 768px) {
          .message-text {
            font-size: 15px;
          }
        }

        .message-time {
          color: rgba(255, 255, 255, 0.5);
          font-size: 11px;
        }

        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .typing-text {
          font-weight: 600;
          font-size: 12px;
          color: #10b981;
        }

        @media (min-width: 768px) {
          .typing-text {
            font-size: 14px;
          }
        }

        .typing-dots {
          display: flex;
          gap: 4px;
        }

        .dot {
          width: 6px;
          height: 6px;
          background-color: #10b981;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }

        /* Input Section */
        .chat-input-section {
          background-color: rgba(255, 255, 255, 0.05);
          border-top: 1px solid rgba(16, 185, 129, 0.2);
          padding: 16px;
          flex-shrink: 0;
        }

        @media (min-width: 768px) {
          .chat-input-section {
            padding: 20px 24px;
          }
        }

        .input-wrapper {
          display: flex;
          gap: 10px;
          align-items: flex-end;
          margin-bottom: 12px;
        }

        @media (min-width: 768px) {
          .input-wrapper {
            gap: 16px;
          }
        }

        .chat-textarea {
          flex: 1;
          padding: 12px 14px;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: #ffffff;
          font-size: 14px;
          resize: none;
          outline: none;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        @media (min-width: 768px) {
          .chat-textarea {
            padding: 14px 18px;
            border-radius: 14px;
            font-size: 15px;
          }
        }

        .chat-textarea:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
        }

        .chat-textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .chat-textarea::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .send-btn {
          padding: 12px 20px;
          background: linear-gradient(45deg, #10b981, #059669);
          border: none;
          border-radius: 12px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }

        @media (min-width: 768px) {
          .send-btn {
            padding: 14px 28px;
            font-size: 15px;
            gap: 8px;
          }
        }

        .send-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
        }

        .send-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-text {
          display: none;
        }

        @media (min-width: 640px) {
          .btn-text {
            display: inline;
          }
        }

        .spinner {
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .disclaimer {
          padding: 10px 12px;
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 10px;
        }

        @media (min-width: 768px) {
          .disclaimer {
            padding: 12px 16px;
            border-radius: 12px;
          }
        }

        .disclaimer small {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.5;
          font-size: 11px;
          display: block;
        }

        @media (min-width: 768px) {
          .disclaimer small {
            font-size: 12px;
          }
        }

        /* Scrollbar */
        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.5);
          border-radius: 3px;
        }

        .chat-messages::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.7);
        }
      `}</style>
    </>
  );
};

export default AIHealthChatBot;