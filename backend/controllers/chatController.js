import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Simple chat endpoint
export const chatWithAI = async (req, res) => {
  try {
    const { message, context = [] } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    // Build messages array for context
    const messages = [
      ...context,
      { role: "user", content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // fast and cheaper than GPT-4
      messages,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat failed" });
  }
};
