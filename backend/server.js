import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import VideoRouter from "./routes/videoRoutes.js";
import path from "path";
import ProfessorRouter from "./routes/professorRoutes.js";
import OpenAI from "openai";
const app = express();
const port = process.env.PORT || 5000;

// Connect DB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173","http://localhost:5174","https://campusvoice-admin.onrender.com"],
  credentials: true,
}));
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
// Routes
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

app.get("/", (req, res) => res.send("API working ✅"));
app.use("/api/professors", ProfessorRouter); // plural
app.use("/api/videos", VideoRouter);
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// Start server
app.listen(port, () => console.log(`🚀 Server started on PORT: ${port}`));

