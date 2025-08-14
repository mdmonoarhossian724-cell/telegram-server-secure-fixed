import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { RateLimiterMemory } from "rate-limiter-flexible";

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: "*",
  methods: ["POST", "GET"],
}));

// Simple rate limit: 10 req/min per IP
const rateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 60
});

app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch {
    res.status(429).json({ error: "Too Many Requests" });
  }
});

// Healthcheck
app.get("/", (req, res) => {
  res.send("Telegram Microworkers Bot Server ✅ (secure)");
});

// Secure send-message route
app.post("/send-message", async (req, res) => {
  const { text, secretKey } = req.body;

  // Require secret key
  if (!secretKey || secretKey !== process.env.SECRET_KEY) {
    return res.status(403).json({ error: "Unauthorized request" });
  }
  if (!text || typeof text !== "string" || text.length > 2000) {
    return res.status(400).json({ error: "Invalid or missing 'text'" });
  }

  const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;
  const data = {
    chat_id: process.env.CHAT_ID,
    text,
    disable_web_page_preview: true
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    res.status(response.ok ? 200 : 500).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
