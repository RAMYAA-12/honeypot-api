const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  try {
    return res.status(200).json({
      status: "success",
      message: "Request received",
      timestamp: new Date().toISOString()
    });
  } catch {
    return res.status(200).json({
      status: "success",
      message: "Request received"
    });
  }
});

module.exports = router;
