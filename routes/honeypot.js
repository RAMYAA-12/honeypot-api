const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// In-memory IP risk tracking
const ipRisk = {};

router.post('/', (req, res) => {
  try {
    const ip = req.ip;

    // Initialize IP tracking
    if (!ipRisk[ip]) {
      ipRisk[ip] = { score: 0, attempts: 0 };
    }
    ipRisk[ip].attempts++;

    // Handle payload safely
   let payload = req.body;

// Normalize empty body
if (!payload || payload === '') {
  payload = {};
}
    // Attack detection
    const attackRegex = /select|union|drop|<script>|--|\bor\b\s+1=1/i;
    const payloadString = JSON.stringify(payload);
    const suspicious = attackRegex.test(payloadString);

    ipRisk[ip].score += suspicious ? 5 : 1;

    const logEntry = {
      ip,
      headers: req.headers,
      payload,
      suspicious,
      risk_score: ipRisk[ip].score,
      attempts: ipRisk[ip].attempts,
      timestamp: new Date().toISOString()
    };

    // Safe logging (never crash)
    try {
      fs.mkdirSync('./logs', { recursive: true });
      fs.appendFileSync(
        './logs/attacks.log',
        JSON.stringify(logEntry) + '\n'
      );
    } catch (logErr) {
      console.error('Log write failed:', logErr.message);
      console.log('ATTACK LOG:', logEntry);
    }

    // Always respond successfully
    return res.status(200).json({
      status: "success",
      message: "Request received",
      request_id: `hp-${uuidv4()}`,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    // LAST LINE OF DEFENSE (honeypots must never crash)
    console.error('Honeypot handler error:', err.message);

    return res.status(200).json({
      status: "success",
      message: "Request received",
      note: "Handled safely despite internal error"
    });
  }
});

module.exports = router;
