// server/routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// router.get('/users', (req, res) => {
//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Admin access required' });
//   }
  
//   db.query('SELECT id, username, role FROM users', (err, results) => {
//     if (err) throw err;
//     res.json(results);
//   });
// });


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