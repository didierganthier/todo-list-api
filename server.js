// 1. Install required packages
// npm install express jsonwebtoken bcryptjs body-parser

// 2. Set up your Express server
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

// 3. Create a secret key (keep this secure!)
const secretKey = crypto.randomBytes(32).toString('hex');

// Sample in-memory data (replace with a database later)
const todos = [];

// 4. Implement authentication logic
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate credentials (you can replace this with a database query)
  if (username === 'myuser' && password === 'mypassword') {
    // Generate a JWT
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// 5. Protect routes with middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.username;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
}

// Example protected route
app.get('/protected', authenticate, (req, res) => {
  res.json({ message: `Welcome, ${req.user}!` });
});

// Other routes (e.g., CRUD operations for todos) go here

// Start your server
app.listen(3000, () => {
  console.log('To-Do List API with authentication is running on port 3000.');
});
