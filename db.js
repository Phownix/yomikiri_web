const env = require("dotenv").config();
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGO_CLIENT+'/'+process.env.MONGO_DB;

const mongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    return true; // Resuelve la promesa con éxito
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    return false; // Rechaza la promesa con el error
  }
};

module.exports = mongoDB;
