// server/index.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const db = require('./config/db');
const menuRoutes = require('./routes/menu');
const restaurantRoutes = require('./routes/restaurants');
const menuItemsnewRoutes = require ('./routes/menuItemsnew');
const cartsRoutes = require ('./routes/carts');
const addressdetails = require ('./routes/addressdetails')
// const menuItemsRoutes =  require('./routes/menuItems');
const orderdetails = require ('./routes/orderdetails');

// deliveryPartner
const authDeliveryPartner = require('./routes/deliveryPartner/authDeliveryPartner');

const app = express();

app.use(express.json());
app.use(cors());

// Create users table


app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/menuItemsnew', menuItemsnewRoutes);
// app.use(`/api/restaurants`, restaurantsRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/carts', cartsRoutes);
app.use('/api/addressdetails', addressdetails)
app.use('/api/orderdetails', orderdetails)

// DeliveryPartner
app.use('/api/deliveryPartner/authDeliveryPartner', authDeliveryPartner)
// 15-06-2026 start
app.get("/", (req, res) => {
  res.json({
    message: "Backend API is running successfully"
  });
});
// 15-06-2026 end
// Local development server
if (require.main === module) {
  app.listen(5000, () => console.log('Server running on port 5000'));
}

// Required for Vercel serverless functions
module.exports = app;