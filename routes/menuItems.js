const express = require('express');
const router = express.Router();
const db = require('../config/db');

//get resto details
router.get('/', async (req,res)=>{
    try{    
        const[menu_itrms] = await db.query('SELECT * FROM menu_itrms');
        res.json({
            message:'restaurants successfully',
            data: menu_itrms
        })

    } catch(error){
        console.error('error', error);
        res.status(500).json({message:'server error'});
    }
})
module.exports = router;