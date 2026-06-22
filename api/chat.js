// api/chat.js
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Message is required and must be a non-empty string'
      });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not configured');
      return res.status(500).json({
        error: 'Server configuration error',
        details: 'AI service is not properly configured'
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',  // Fast + affordable for health chat
        max_tokens: 700,
        system: 'You are a compassionate and knowledgeable AI health assistant. Provide helpful, evidence-based health information while being empathetic. Always remind users that you are not a replacement for professional medical advice and encourage them to consult healthcare providers for serious concerns. Keep responses clear, concise, and actionable.',
        messages: [
          {
            role: 'user',
            content: `A person describes their symptoms: "${message.trim()}"\n\nPlease provide:\n1. Acknowledgment of their concern\n2. Possible general causes (without diagnosing)\n3. When to seek medical care\n4. Self-care suggestions if appropriate\n5. Reminder about professional medical advice\n\nKeep the response helpful, clear, and compassionate.`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Anthropic API Error:', response.status, errorData);

      // Handle specific Anthropic error codes gracefully
      if (response.status === 429) {
        return res.status(429).json({
          error: 'Too many requests',
          details: 'Please wait a moment before trying again.'
        });
      }
      if (response.status === 401) {
        return res.status(500).json({
          error: 'Server configuration error',
          details: 'AI service authentication failed.'
        });
      }

      return res.status(502).json({
        error: 'AI service temporarily unavailable',
        details: 'Please try again in a moment.'
      });
    }

    const data = await response.json();

    if (data.content && data.content[0] && data.content[0].text) {
      return res.status(200).json({
        success: true,
        message: data.content[0].text,
        model: data.model,
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error('Invalid API response format');
    }

  } catch (error) {
    console.error('Server Error:', error.message);
    return res.status(500).json({
      error: 'Internal server error',
      details: 'Something went wrong. Please try again later.'
    });
  }
}