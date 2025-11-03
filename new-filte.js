const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/user", (req, res) => {
  // Require a valid bearer token in the Authorization header.
  // In production, replace this simple check with proper authentication/authorization.
  const authHeader = req.headers.authorization || '';
  const expectedToken = process.env.API_TOKEN || 'secrettoken';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.slice(7);
  if (token !== expectedToken) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const userId = req.body.userid;
  if (!userId) {
    return res.status(400).json({ error: "Missing userid in request body" });
  }
  // Dummy user data (sensitive fields omitted)
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