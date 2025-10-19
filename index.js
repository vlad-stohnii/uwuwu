const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/user", (req, res) => {
  // CSRF protection: only allow AJAX JSON requests
  if (req.get("X-Requested-With") !== "XMLHttpRequest") {
    return res.status(403).json({ error: "Forbidden - invalid request source" });
  }
  if (!req.is("application/json")) {
    return res.status(415).json({ error: "Unsupported Media Type" });
  }
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
