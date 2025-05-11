const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' }); 
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB conectado com sucesso');
  } catch (err) {
    console.error('❌ Erro na conexão com MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
