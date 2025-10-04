// server.js - Backend API for Health AI Assistant (Production Ready)
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Set your frontend URL in production
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Trust proxy for deployment platforms like Render, Heroku, etc.
app.set('trust proxy', 1);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'running',
    message: 'Health AI Assistant API Server',
    version: '1.0.0',
    endpoints: {
      health: 'GET /',
      chat: 'POST /api/chat'
    }
  });
});

// Additional health check for monitoring services
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Chat endpoint - handles AI requests
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // Validate request
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Message is required and must be a non-empty string' 
      });
    }

    // Message length validation
    if (message.length > 2000) {
      return res.status(400).json({
        error: 'Message too long',
        details: 'Please keep your message under 2000 characters'
      });
    }

    // Check if API key is configured
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not configured');
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: 'AI service is not properly configured'
      });
    }

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a compassionate and knowledgeable AI health assistant. Provide helpful, evidence-based health information while being empathetic. Always remind users that you are not a replacement for professional medical advice and encourage them to consult healthcare providers for serious concerns. Keep responses clear, concise, and actionable.'
          },
          {
            role: 'user',
            content: `A person describes their symptoms: "${message}"\n\nPlease provide:\n1. Acknowledgment of their concern\n2. Possible general causes (without diagnosing)\n3. When to seek medical care\n4. Self-care suggestions if appropriate\n5. Reminder about professional medical advice\n\nKeep the response helpful, clear, and compassionate.`
          }
        ],
        temperature: 0.7,
        max_tokens: 600,
        top_p: 0.9,
      }),
    });

    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API Error:', response.status, errorData);
      
      return res.status(response.status).json({
        error: 'AI service temporarily unavailable',
        details: 'Please try again in a moment'
      });
    }

    // Parse and return AI response
    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return res.json({
        success: true,
        message: data.choices[0].message.content,
        model: data.model,
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error('Invalid API response format');
    }

  } catch (error) {
    console.error('Server Error:', error.message);
    
    // Handle different error types
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return res.status(503).json({
        error: 'Unable to reach AI service',
        details: 'Service temporarily unavailable. Please try again.'
      });
    }
    
    res.status(500).json({
      error: 'Internal server error',
      details: 'Something went wrong. Please try again later.'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    error: 'Something went wrong',
    details: 'Internal server error'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════╗
║   Health AI Assistant API Server          ║
║   Status: Running                          ║
║   Port: ${PORT}                              ║
║   Environment: ${process.env.NODE_ENV || 'development'}            ║
╚════════════════════════════════════════════╝

Endpoints:
  - GET  /           → Health check
  - GET  /health     → Service health
  - POST /api/chat   → AI chat endpoint

GROQ API Key: ${process.env.GROQ_API_KEY ? '✓ Configured' : '✗ Missing'}
  `);
  
  if (!process.env.GROQ_API_KEY) {
    console.warn('\n⚠️  WARNING: GROQ_API_KEY not found in environment variables!');
    console.warn('   The API will not work without it.\n');
  }
});