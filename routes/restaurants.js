const express = require('express');
const router = express.Router();
const db = require('../config/db');

//get resto details
router.get('/', async (req,res)=>{
    try{    
        const[restaurants] = await db.query('SELECT * FROM restaurants');
        res.json({
            message:'restaurants successfully',
            data: restaurants
        })

    } catch(error){
        console.error('error', error);
        res.status(500).json({message:'server error'});
    }
});

router.get('/:restaurant_id', async (req, res) => {
    try {
        const restaurantId = req.params.restaurant_id;
        const [restaurants] = await db.query(
            'SELECT * FROM restaurants WHERE restaurant_id = ?',
            [restaurantId]
        );
        
        if (restaurants.length === 0) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        
        res.json({
            message: 'Restaurant retrieved successfully',
            data: restaurants // returns single restaurant object
        });
    } catch (error) {
        console.error('error', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/idwise/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the URL parameter
        const [menu_items] = await db.query('SELECT * FROM restaurants WHERE id = ?', [id]);
        
        if (menu_items.length === 0) {
            return res.status(404).json({
                message: 'restaurants item not found'
            });
        }
        
        res.json({
            message: 'restaurants received successfully',
            data: menu_items // Return the first (and only) item
        });
  
    } catch (error) {
        console.error('error', error);
        res.status(500).json({ message: 'Server error' });
    }
  });
router.get('/:RestoName', async (req, res) => {
    try {
        const restaurantRestoName = req.params.RestoName;
        const [restaurantsName] = await db.query(
            'SELECT * FROM restaurants WHERE RestoName = ?',
            [restaurantRestoName]
        );
        
        if (restaurantsName.length === 0) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        
        res.json({
            message: 'Restaurant retrieved successfully',
            data: restaurantsName // returns single restaurant object
        });
    } catch (error) {
        console.error('error', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/restoPost', async (req, res) => {
    try {
        //debugger
      const { 
        restaurant_id,RestoName,Address,Locality,City_id,State_id,Country_id,Rating,Status,Is_accepting_orders
        //restaurant_id, Price,Image_name,Item_name,VegNonVeg,Rating
    } = req.body; 
      await db.query(
        'INSERT INTO restaurants (restaurant_id,RestoName,Address,Locality,City_id,State_id,Country_id,Rating,Status,Is_accepting_orders) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [
            restaurant_id,RestoName,Address,Locality,City_id,State_id,Country_id,Rating,Status,Is_accepting_orders
            // restaurant_id, Price,Image_name,Item_name,VegNonVeg,Rating
        ]
      );  
      res.status(201).json({ message: 'Restaurants added successfully' });
    } catch (error) {
      console.error('Error adding menu item:', error);
      res.status(500).json({ message: 'Server error' }); 
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const [result] = await db.query('DELETE FROM restaurants WHERE id = ?', [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'restaurants not found' });
      }
  
      res.json({ message: 'restaurants deleted successfully' });
    } catch (error) {
      console.error('Error deleting restaurants:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Update 
  router.put('/restoPut/:id', async (req, res) => {
    //debugger
    try {
      const { id } = req.params;
      const { 
        restaurant_id,RestoName,Address,Locality,City_id,State_id,Country_id,Rating,Status,Is_accepting_orders
      } = req.body;
  
      // Validate required fields
      // if (!restaurant_id || !Category_id || !Item_name || !vegNonVeg || !Price || !Description) {
      //   return res.status(400).json({ message: 'All required fields must be provided' });
      // }
  
      const [result] = await db.query(
        'UPDATE restaurants SET restaurant_id = ?, RestoName = ?, Address = ?, Locality = ?, City_id = ?, State_id = ?, Country_id = ?,Rating = ?, Status = ?, Is_accepting_orders = ? WHERE id = ?',
        [restaurant_id,RestoName,Address,Locality,City_id,State_id,Country_id,Rating,Status,Is_accepting_orders,id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'restaurants not found' });
      }
  
      res.json({ message: 'restaurants updated successfully' });
    } catch (error) {
      console.error('Error updating restaurants:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });


module.exports = router;