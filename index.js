const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

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

const https = require('https');
const fs = require('fs');

const useHttps = process.env.SSL_KEY && process.env.SSL_CERT;

if (useHttps) {
  const key = fs.readFileSync(process.env.SSL_KEY);
  const cert = fs.readFileSync(process.env.SSL_CERT);
  https.createServer({ key, cert }, app).listen(port, () => {
    console.log(`Example app listening at https://localhost:${port}`);
  });
} else {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    console.warn('Warning: HTTPS not enabled. Set SSL_KEY and SSL_CERT environment variables to enable HTTPS in production.');
  });
}
