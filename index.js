const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

// Simple API key authentication middleware
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error("Error: API_KEY environment variable is not set.");
  process.exit(1);
}
app.use((req, res, next) => {
  const authHeader = req.headers['x-api-key'];
  if (authHeader !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
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

app.listen(port, '127.0.0.1', () => {
  console.log(`Example app listening at http://127.0.0.1:${port}`);
});
