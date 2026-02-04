const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
// In-memory IP risk tracking
const ipRisk = {};

router.post('/', (req, res) => {
  let payload = req.body;
  const ip = req.ip;

// Initialize IP tracking
if (!ipRisk[ip]) {
  ipRisk[ip] = { score: 0, attempts: 0 };
}
ipRisk[ip].attempts++;

const attackRegex = /select|union|drop|<script>|--|\bor\b\s+1=1/i;
const payloadString = JSON.stringify(payload);

let suspicious = false;
if (attackRegex.test(payloadString)) {
  suspicious = true;
  ipRisk[ip].score += 5;
} else {
  ipRisk[ip].score += 1;
}


  // Try JSON parse, never fail
  if (typeof req.body === 'string') {
    try {
      payload = JSON.parse(req.body);
    } catch {
      payload = { raw_payload: req.body };
    }
  }

  const logEntry = {
  ip,
  headers: req.headers,
  payload,
  suspicious,
  risk_score: ipRisk[ip].score,
  attempts: ipRisk[ip].attempts,
  timestamp: new Date().toISOString()
};

if (ipRisk[ip].score >= 15) {
  console.warn(`🚨 High-risk IP detected: ${ip}`);
}

  fs.appendFileSync(
    './logs/attacks.log',
    JSON.stringify(logEntry) + '\n'
  );

  res.status(200).json({
    status: "success",
    message: "Request received",
    request_id: `hp-${uuidv4()}`,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
