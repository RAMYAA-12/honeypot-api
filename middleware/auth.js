module.exports = function (req, res, next) {

  // ✅ Allow CORS preflight requests (tester requirement)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  const apiKey =
    req.headers['x-api-key'] ||
    (req.headers['authorization'] &&
      req.headers['authorization'].split(' ')[1]);

  if (!apiKey) {
    return res.status(401).json({ error: "API key missing" });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  next();
};
