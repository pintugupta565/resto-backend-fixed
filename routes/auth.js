// server/routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Input validation
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Use promise-based query
      await db.query(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword]
      );
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      // Handle specific MySQL errors
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email already exists' });
      }
      
      // Log the error for debugging (in production, use a proper logger)
      console.error('Registration error:', error);
      
      res.status(500).json({ message: 'Server error' });
    }
  });

// Login
router.post('/login', async (req, res) => {
  // debugger  
  try {
      const { email, password } = req.body;
  
      // Input validation
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      // Fetch user
      const [results] = await db.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
  
      if (results.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key', // Use env variable in production
        { expiresIn: '1h' } // Token expires in 1 hour
      );
  
      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/users', async (req, res) => {
    try {
      const [users] = await db.query(
        'SELECT * FROM users'
      );
      res.json({
        message: 'Users retrieved successfully',
        data: users
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
 

module.exports = router;