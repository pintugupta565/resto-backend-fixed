const express = require('express');
const router = express.Router();
const db = require('../config/db');

//get resto details
router.get('/', async (req,res)=>{
  // debugger
    try{    
        const[carts] = await db.query('SELECT * FROM carts');
        res.json({
            message:'restaurants successfully',
            data: carts
        })
    } catch(error){
        console.error('error', error);
        res.status(500).json({message:'server error'});
    }
});
router.get('/idwise/:user_id', async (req, res) => {
  try {
      const { user_id } = req.params; // Get the ID from the URL parameter
      const [carts] = await db.query('SELECT * FROM carts WHERE user_id = ?', [user_id]);
      
      if (carts.length == 0) {
          return res.status(404).json({
              message: 'carts item not found'
          });
      } 
      
      res.json({
          message: 'carts item retrieved successfully',
          data: carts // Return the first (and only) item
      });

  } catch (error) {
      console.error('error', error);
      res.status(500).json({ message: 'Server error' });
  }
});
//add cart
router.post('/cartPost', async (req, res) => {
    try {
      //debugger
      const { restaurant_id, Price,Image_name,Item_name,Rating,vegNonVeg,orderID,user_id,deliveryPartner_id,quantity} = req.body;
   
      await db.query(
        'INSERT INTO carts (restaurant_id, Price,Image_name,Item_name,Rating,vegNonVeg,orderID,user_id,deliveryPartner_id,quantity) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [restaurant_id, Price,Image_name,Item_name,Rating,vegNonVeg,orderID,user_id,deliveryPartner_id,quantity]
      );  
      res.status(201).json({ message: 'Menu item added successfully' });
    } catch (error) {
      console.error('Error adding menu item:', error);
      res.status(500).json({ message: 'Server error' }); 
    }
  }); 
  //update
  router.put('/cartPut/:id', async (req, res) => {
    //debugger
    try {
      const { id } = req.params;
      const { 
        restaurant_id, Price,Image_name,Item_name,Rating,vegNonVeg,orderID,user_id,deliveryPartner_id,quantity
      } = req.body;
  
      // Validate required fields
      // if (!restaurant_id || !Category_id || !Item_name || !vegNonVeg || !Price || !Description) {
      //   return res.status(400).json({ message: 'All required fields must be provided' });
      // }
  
      const [result] = await db.query(
        'UPDATE carts SET restaurant_id = ?, Price = ?, Image_name = ?, Item_name = ?, Rating = ?, vegNonVeg = ?, orderID = ?, user_id = ?,deliveryPartner_id = ?, quantity = ? WHERE id = ?',
        [restaurant_id, Price,Image_name,Item_name,Rating,vegNonVeg,orderID,user_id,deliveryPartner_id,quantity,id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'carts item not found' });
      }
  
      res.json({ message: 'carts item updated successfully' });
    } catch (error) {
      console.error('Error updating carts item:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  //delete
  router.delete('/cartDel/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const [result] = await db.query('DELETE FROM carts WHERE id = ?', [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'carts item not found' });
      }
      res.json({ message: 'carts item deleted successfully' });
    } catch (error) {
      console.error('Error deleting carts item:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  //user_id
  //delete cart
  router.delete('/cartClear/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;
  
      const [result] = await db.query('DELETE FROM carts WHERE user_id = ?', [user_id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'No cart items found for this user' });
      }
      res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;