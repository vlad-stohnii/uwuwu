const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/user", (req, res) => {
  const userId = req.body.userid;
  const authUser = req.headers['x-user-id'];
  if (!authUser) {
    return res.status(401).json({ error: "Unauthorized: missing X-User-Id header" });
  }
  if (!userId) {
    return res.status(400).json({ error: "Missing userid in request body" });
  }
  if (userId !== authUser) {
    return res.status(403).json({ error: "Forbidden: cannot access other user's data" });
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
