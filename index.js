require('dotenv').config();
const express = require('express');
const auth = require('./middleware/auth');
const honeypotRoute = require('./routes/honeypot');
const rateLimit = require('express-rate-limit');

const app = express();
// Rate limiting (anti-flood protection)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests",
      message: "Rate limit exceeded"
    });
  }
});

app.use(limiter);

/**
 * ✅ RAW BODY PARSER (accepts ANY payload)
 * This MUST be the ONLY body parser
 */
app.use(express.text({ type: '*/*' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: "up" });
});

// Honeypot endpoint
app.use('/honeypot', auth, honeypotRoute);

// Trap endpoint
app.post('/admin', (req, res) => {
  res.status(401).json({
    error: "Invalid admin credentials",
    attempt_logged: true
  });
});

// Info endpoint for judges
app.get('/info', (req, res) => {
  res.json({
    project: "Honeypot API",
    purpose: "Capture and analyze malicious API behavior",
    protections: [
      "API key authentication",
      "Rate limiting",
      "Attack pattern detection",
      "IP risk scoring"
    ],
    data_logged: [
      "IP address",
      "Headers",
      "Payload",
      "Suspicious flag",
      "Risk score"
    ],
    note: "No real data is stored or exposed"
  });
});

// Root route (optional)
app.get('/', (req, res) => {
  res.json({
    message: "Honeypot API is running",
    endpoints: [
      "/health",
      "/honeypot",
      "/admin",
      "/info"
    ]
  });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Honeypot running on port ${PORT}`);
});
