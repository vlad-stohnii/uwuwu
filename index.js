const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

// Security headers to mitigate clickjacking, MIME sniffing, and other attacks
app.use((req, res, next) => {
  // Restrict resources to same origin by default
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");
  // Disable MIME-type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Reduce referrer leakage
  res.setHeader("Referrer-Policy", "no-referrer");
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