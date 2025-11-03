const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

// Security headers middleware
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");
  // Prevent MIME-sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Referrer policy
  res.setHeader("Referrer-Policy", "no-referrer");
  // Basic XSS protection (mostly for older browsers)
  res.setHeader("X-XSS-Protection", "1; mode=block");
  // Simple Content Security Policy - adjust if the app needs to load resources from other origins
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  // Only set HSTS when connection is secure (behind HTTPS)
  if (req.secure || req.headers["x-forwarded-proto"] === "https") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/user", (req, res) => {
  const userId = req.body.userid;
  if (!userId) {
    return res.status(400).json({ error: "Missing userid in request body" });
  }
  // Dummy user data
  const user = {
    userid: userId,
    name: "John Doe",
    email: "johndoe@example.com",
    role: "user"
  };
  res.json(user);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});