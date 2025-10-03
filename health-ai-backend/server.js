// server.js - Backend API for Health AI Assistant
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON bodies

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'running',
    message: 'Health AI Assistant API Server',
    endpoints: {
      health: 'GET /',
      chat: 'POST /api/chat'
    }
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

    // Check if API key is configured
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ 
        error: 'Server configuration error: GROQ_API_KEY not set',
        setup: 'Please add GROQ_API_KEY to your .env file'
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
      const errorData = await response.json();
      console.error('Groq API Error:', errorData);
      
      return res.status(response.status).json({
        error: 'AI service error',
        details: errorData.error?.message || 'Unknown error occurred',
        status: response.status
      });
    }

    // Parse and return AI response
    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return res.json({
        success: true,
        message: data.choices[0].message.content,
        model: data.model,
        usage: data.usage
      });
    } else {
      throw new Error('Invalid API response format');
    }

  } catch (error) {
    console.error('Server Error:', error);
    
    // Handle different error types
    if (error.message.includes('fetch')) {
      return res.status(503).json({
        error: 'Unable to reach AI service',
        details: 'Please check your internet connection and try again'
      });
    }
    
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    error: 'Something went wrong',
    details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   Health AI Assistant API Server          ║
║   Status: Running                          ║
║   Port: ${PORT}                              ║
║   Environment: ${process.env.NODE_ENV || 'development'}            ║
╚════════════════════════════════════════════╝

Endpoints:
  - GET  /           → Health check
  - POST /api/chat   → AI chat endpoint

GROQ API Key: ${process.env.GROQ_API_KEY ? '✓ Configured' : '✗ Missing'}
  `);
  
  if (!process.env.GROQ_API_KEY) {
    console.warn('\n⚠️  WARNING: GROQ_API_KEY not found in environment variables!');
    console.warn('   Please create a .env file with: GROQ_API_KEY=your_api_key_here\n');
  }
});