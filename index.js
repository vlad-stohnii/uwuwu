const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

// Simple in-memory rate limiter middleware to mitigate brute-force/DoS.
// This is intentionally lightweight to avoid adding external dependencies.
// Notes: Uses req.ip; for deployments behind proxies, ensure `app.set('trust proxy', true)` if desired.
const _rateLimitStore = new Map();

function createRateLimiter(options) {
  const windowMs = options.windowMs || 15 * 60 * 1000; // default 15 minutes
  const max = options.max || 100; // default 100 requests per window

  // Periodic cleanup to prevent unbounded memory growth.
  // Remove entries older than twice the window.
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of _rateLimitStore) {
      if (now - entry.startTime > windowMs * 2) {
        _rateLimitStore.delete(key);
      }
    }
  }, Math.min(windowMs, 60 * 1000)); // cleanup at least every minute or every windowMs

  return (req, res, next) => {
    try {
      const key = req.ip || req.connection.remoteAddress || 'unknown';
      const now = Date.now();
      const current = _rateLimitStore.get(key);
      if (!current || now - current.startTime > windowMs) {
        _rateLimitStore.set(key, { count: 1, startTime: now });
        return next();
      }

      current.count += 1;
      if (current.count > max) {
        res.status(429).json({ error: 'Too many requests, please try again later.' });
      } else {
        next();
      }
    } catch (err) {
      // In case of unexpected error in limiter, allow request to proceed to avoid breaking application.
      next();
    }
  };
}

// Apply a global limiter: 100 requests per 15 minutes per IP
app.use(createRateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));

// Stricter limiter for user creation endpoint: 10 requests per minute per IP
const createUserLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 10 });

// Simple in-memory rate limiter middleware to mitigate brute-force/DoS.
// This is intentionally lightweight to avoid adding external dependencies.
// Notes: Uses req.ip; for deployments behind proxies, ensure `app.set('trust proxy', true)` if desired.
const _rateLimitStore = new Map();

function createRateLimiter(options) {
  const windowMs = options.windowMs || 15 * 60 * 1000; // default 15 minutes
  const max = options.max || 100; // default 100 requests per window

  // Periodic cleanup to prevent unbounded memory growth.
  // Remove entries older than twice the window.
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of _rateLimitStore) {
      if (now - entry.startTime > windowMs * 2) {
        _rateLimitStore.delete(key);
      }
    }
  }, Math.min(windowMs, 60 * 1000)); // cleanup at least every minute or every windowMs

  return (req, res, next) => {
    try {
      const key = req.ip || req.connection.remoteAddress || 'unknown';
      const now = Date.now();
      const current = _rateLimitStore.get(key);
      if (!current || now - current.startTime > windowMs) {
        _rateLimitStore.set(key, { count: 1, startTime: now });
        return next();
      }

      current.count += 1;
      if (current.count > max) {
        res.status(429).json({ error: 'Too many requests, please try again later.' });
      } else {
        next();
      }
    } catch (err) {
      // In case of unexpected error in limiter, allow request to proceed to avoid breaking application.
      next();
    }
  };
}

// Apply a global limiter: 100 requests per 15 minutes per IP
app.use(createRateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));

// Stricter limiter for user creation endpoint: 10 requests per minute per IP
const createUserLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 10 });

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