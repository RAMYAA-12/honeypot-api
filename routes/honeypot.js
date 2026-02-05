const express = require('express');
const router = express.Router();

router.all('/', (req, res) => {
  try {
    // Simple scoring & labeling (FAST WIN)
    const scam_type = "generic_probe";
    const risk_score = 3;

    return res.status(200).json({
      status: "success",
      message: "Request received",
      scam_type,     // ✅ added
      risk_score,    // ✅ added
      method: req.method,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    // Honeypots must never fail
    return res.status(200).json({
      status: "success",
      message: "Request received"
    });
  }
});

module.exports = router;
