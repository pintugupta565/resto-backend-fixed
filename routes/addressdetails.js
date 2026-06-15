const express = require('express');
const router = express.Router();
const db = require('../config/db');

//get resto details
router.get('/', async (req,res)=>{
    try{    
        const[menu_itrms] = await db.query('SELECT * FROM addressdetails');
        res.json({
            message:'addressdetails successfully',
            data: menu_itrms
        })

    } catch(error){
        console.error('error', error);
        res.status(500).json({message:'server error'});
    }
});
 
router.get('/idwise/:id', async (req, res) => {
  try {
      const { id } = req.params; // Get the ID from the URL parameter
      const [menu_items] = await db.query('SELECT * FROM addressdetails WHERE id = ?', [id]);
      
      if (menu_items.length === 0) {
          return res.status(404).json({
              message: 'addressdetails not found'
          });
      }
      
      res.json({
          message: 'addressdetails retrieved successfully',
          data: menu_items // Return the first (and only) item
      });

  } catch (error) {
      console.error('error', error);
      res.status(500).json({ message: 'Server error' });
  }
});
  
router.post('/addressPost', async (req, res) => {
    try {
       // debugger
      const { 
        email,fName,lName,userAddress,city,state,phoneNumber,zip,typeOfAddress,activeAddress
        //restaurant_id, Price,Image_name,Item_name,VegNonVeg,Rating
    } = req.body; 
      await db.query(
        'INSERT INTO addressdetails (email,fName,lName,userAddress,city,state,phoneNumber,zip,typeOfAddress,activeAddress) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [
          email,fName,lName,userAddress,city,state,phoneNumber,zip,typeOfAddress,activeAddress
            // restaurant_id, Price,Image_name,Item_name,VegNonVeg,Rating
        ]
      );  
      res.status(201).json({ message: 'address added successfully' });
    } catch (error) {
      console.error('Error adding address:', error);
      res.status(500).json({ message: 'Server error' }); 
    }
  });
  
  router.delete('/deleteID/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const [result] = await db.query('DELETE FROM addressdetails WHERE id = ?', [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'addressdetails not found' });
      }
  
      res.json({ message: 'addressdetails deleted successfully' });
    } catch (error) {
      console.error('Error deleting menu item:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Update a menu item (protected)
  router.put('/AddressPut/:id', async (req, res) => {
    debugger
    try {
      const { id } = req.params;
      const { 
        email,fName,lName,userAddress,city,state,phoneNumber,zip,typeOfAddress,activeAddress
      } = req.body;
  
      // Validate required fields
      // if (!restaurant_id || !Category_id || !Item_name || !vegNonVeg || !Price || !Description) {
      //   return res.status(400).json({ message: 'All required fields must be provided' });
      // }
  
      const [result] = await db.query(
        'UPDATE addressdetails SET email = ?, fName = ?, lName = ?, userAddress = ?, city = ?, state = ?, phoneNumber = ?, zip = ?, typeOfAddress = ?, activeAddress = ? WHERE id = ?',
        [email,fName,lName,userAddress,city,state,phoneNumber,zip,typeOfAddress,activeAddress,id]
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

// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//    // const { menuItem, price, description, vegNonveg } = req.body;

//     // if (!menuItem || !price || !description || !vegNonveg) {
//     //   return res.status(400).json({ message: 'All fields are required' });
//     // }

//     const [result] = await db.query(
//       'UPDATE menu SET restaurant_id = ?, Category_id = ?, Item_name = ?, vegNonVeg = ?, Image_name = ?, Price = ?, Rating = ?, Status=?,Status=?, Description=?, id=? WHERE id = ?',
//       [restaurant_id,Category_id,Item_name,vegNonVeg,Image_name,Price,Rating,Status,Description, id]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Menu item not found' });
//     }

//     res.json({ message: 'Menu item updated successfully' });
//   } catch (error) {
//     console.error('Error updating menu item:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

module.exports = router;