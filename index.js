const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

// Simple in-memory rate limiter
const rateLimitWindowMs = 60000; // 1 minute window
const maxRequestsPerWindow = 100;  // max requests per IP per window
const ipRequestCounts = {};
setInterval(() => {
  for (const ip in ipRequestCounts) {
    delete ipRequestCounts[ip];
  }
}, rateLimitWindowMs);

app.use((req, res, next) => {
  const ip = req.ip;
  ipRequestCounts[ip] = (ipRequestCounts[ip] || 0) + 1;
  if (ipRequestCounts[ip] > maxRequestsPerWindow) {
    return res.status(429).json({ error: "Too many requests" });
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
