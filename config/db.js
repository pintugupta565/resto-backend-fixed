require('dotenv').config();
const mysql = require('mysql2/promise'); // Using promise version for async/await

// Create a connection pool (recommended over single connection)
const db = mysql.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'restodb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;