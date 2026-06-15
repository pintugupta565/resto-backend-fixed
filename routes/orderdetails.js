const express = require('express');
const router = express.Router();
const db = require('../config/db');

//get resto details
router.get('/', async (req, res) => {
  try {
    const [order_details] = await db.query('SELECT * FROM orderdetails');
    res.json({
      message: 'order_details successfully',
      data: order_details
    })

  } catch (error) {
    console.error('error', error);
    res.status(500).json({ message: 'server error' });
  }
}); 

router.get('/idwise/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params; // Get the ID from the URL parameter
    const [address] = await db.query('SELECT * FROM orderdetails WHERE user_id = ?', [user_id]);

    if (address.length === 0) {
      return res.status(404).json({
        message: 'orderdetails not found'
      });
    }

    res.json({
      message: 'orderdetails retrieved successfully',
      data: address // Return the first (and only) item
    });

  } catch (error) {
    console.error('error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/orderidwisejoin/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params; // Get the ID from the URL parameter
    const [address] = await db.query('SELECT * FROM orders INNER JOIN orderdetails on orders.id = orderdetails.order_id WHERE user_id = ?', [user_id]);

    if (address.length === 0) {
      return res.status(404).json({
        message: 'orderdetails not found'
      });
    }

    res.json({
      message: 'orderdetails retrieved successfully',
      data: address // Return the first (and only) item
    });

  } catch (error) {
    console.error('error', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/orderorderstatus/:user_id?/:order_status?', async (req, res) => {
  try {
    const { order_status, user_id } = req.params;

    // Validate input parameters
    if (!order_status && !user_id) {
      return res.status(400).json({ message: 'At least one parameter (order_status or user_id) is required' });
    }

    // Build the WHERE clause dynamically
    let query = 'SELECT * FROM orders INNER JOIN orderdetails ON orders.id = orderdetails.order_id';
    let conditions = [];
    let params = [];

    if (order_status) {
      conditions.push('orders.order_status = ?');
      params.push(order_status);
    }

    if (user_id) {
      conditions.push('orders.user_id = ?');
      params.push(user_id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const [orderDetails] = await db.query(query, params);

    if (orderDetails.length === 0) {
      return res.status(404).json({ message: 'No order details found' });
    }

    res.json({
      message: 'Order details retrieved successfully',
      data: orderDetails,
    });

  } catch (error) {
    console.error('Error retrieving order details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
 
router.post('/orderdetailsPost', async (req, res) => {
  const { orderData  } = req.body;

  // Validate input
  if (!orderData || !orderData.userId || !orderData.items || !Array.isArray(orderData.items)) {
    return res.status(400).json({ message: 'Invalid or missing orderData' });
  }

  try {
    // Insert into `orders` table
    const [orderResult] = await db.execute(
      'INSERT INTO orders (user_id, order_date,userAddress,deliveryPartner_id ,paymentMethod, order_status ) VALUES (?, NOW(),?,?,?,?)',
      [orderData.userId  ,orderData.Address , orderData.deliveryPartner_id , orderData.payment, orderData.orderStatus ]
    );

    const orderId = orderResult.insertId;

    // Insert each item into `orderdetails` table
    const itemInserts = orderData.items.map(item => {
      if (!item.restaurant_id || !item.Price || !item.quantity) {
        throw new Error('Missing required item fields');
      }
      return db.execute(
        'INSERT INTO orderdetails (order_id, restaurant_id, Price, Image_name, Item_name, vegNonVeg, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          orderId, // Use userId, not orderId
          item.restaurant_id,
          item.Price,
          item.Image_name || null,
          item.Item_name || null,
          item.vegNonVeg || null,
          item.quantity
        ]
      );
    });

    await Promise.all(itemInserts);

    res.status(201).json({ message: 'Order details added successfully' });
  } catch (error) {
    console.error('Error adding order details:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/deleteID/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM orderdetails WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'orderdetails not found' });
    }

    res.json({ message: 'orderdetails deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a menu item (protected)
router.put('/orderdetailsPut/:id', async (req, res) => {
  debugger
  try {
    const { id } = req.params;
    const {
      user_id, restaurant_id, deliveryPartner_id, paymentMethod, userAddress, Price, Image_name, Item_name, vegNonVeg, quantity
    } = req.body;

    // Validate required fields
    // if (!restaurant_id || !Category_id || !Item_name || !vegNonVeg || !Price || !Description) {
    //   return res.status(400).json({ message: 'All required fields must be provided' });
    // }

    const [result] = await db.query(
      'UPDATE orderdetails SET email = ?, user_id = ?, restaurant_id = ?, deliveryPartner_id = ?, paymentMethod = ?, userAddress = ?, Price = ?, Image_name = ?, Item_name = ?, vegNonVeg = ?, quantity = ? WHERE id = ?',
      [user_id, restaurant_id, deliveryPartner_id, paymentMethod, userAddress, Price, Image_name, Item_name, vegNonVeg, quantity, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'orderdetails item not found' });
    }

    res.json({ message: 'orderdetails item updated successfully' });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;