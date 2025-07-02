require('dotenv').config();

module.exports = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "postgres",
<<<<<<< HEAD
  PASSWORD: process.env.DB_PASSWORD || "admin",  // Default password
=======
  PASSWORD: process.env.DB_PASSWORD || "your_password_here",
>>>>>>> bf776d704e1fd29e1891b6b0ccfd09fce48987f9
  DB: process.env.DB_NAME || "textura_db",
  PORT: process.env.DB_PORT || 5432,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};