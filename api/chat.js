// api/chat.js

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({
        error: "Message is required.",
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        error: "Message too long. Maximum 2000 characters allowed.",
      });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY not found.");

      return res.status(500).json({
        error: "Server configuration error",
        details: "GROQ_API_KEY is missing.",
      });
    }

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 0.7,
          max_tokens: 600,
          top_p: 0.9,
          messages: [
            {
              role: "system",
              content:
                "You are a compassionate and knowledgeable AI health assistant. Provide helpful, evidence-based health information while being empathetic. Always remind users that you are not a replacement for professional medical advice and encourage them to consult healthcare providers for serious concerns. Keep responses clear, concise, and actionable.",
            },
            {
              role: "user",
              content: `A person describes their symptoms: "${message}"

Please provide:

1. Acknowledge their concern.
2. Mention possible general causes without making a diagnosis.
3. Explain when they should seek medical attention.
4. Suggest safe self-care tips if appropriate.
5. Remind them to consult a healthcare professional.

Keep the response compassionate and easy to understand.`,
            },
          ],
        }),
      }
    );

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();

      console.error("Groq API Error:", groqResponse.status, errorText);

      return res.status(groqResponse.status).json({
        error: "Groq API Error",
        details: errorText,
      });
    }

    const data = await groqResponse.json();

    return res.status(200).json({
      success: true,
      message: data.choices[0].message.content,
      model: data.model,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Server Error:", error);

    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
}