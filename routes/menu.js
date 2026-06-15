const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Middleware to verify JWT (from previous setup)
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Authentication token required' });
//   }

//   jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
//     if (err) {
//       return res.status(403).json({ message: 'Invalid or expired token' });
//     }
//     req.user = user;
//     next();
//   });
// };
  
// Get all menu items
router.get('/', async (req, res) => {
  try {
    const [menuItems] = await db.query('SELECT * FROM menu');
    res.json({
      message: 'Menu items retrieved successfully',
      data: menuItems
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new menu item (protected)
router.post('/', async (req, res) => {
  try {
    const { menuItem, price, description, vegNonveg } = req.body;

    if (!menuItem || !price || !description || !vegNonveg) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    await db.query(
      'INSERT INTO menu (menuItem, price, description, vegNonveg) VALUES (?, ?, ?, ?)',
      [menuItem, price, description, vegNonveg]
    );

    res.status(201).json({ message: 'Menu item added successfully' });
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a menu item (protected)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { menuItem, price, description, vegNonveg } = req.body;

    if (!menuItem || !price || !description || !vegNonveg) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const [result] = await db.query(
      'UPDATE menu SET menuItem = ?, price = ?, description = ?, vegNonveg = ? WHERE id = ?',
      [menuItem, price, description, vegNonveg, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item updated successfully' });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a menu item (protected)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM menu WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;