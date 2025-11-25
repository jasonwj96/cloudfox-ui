const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Intentando conectar a:', process.env.MONGODB_URI || 'mongodb://localhost:27017/cloudfox');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cloudfox', {
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000 // 45 
    });

    
    const db = mongoose.connection.db;
    console.log('✅ MongoDB conectado a:', db.databaseName);
    console.log('Colecciones disponibles:', (await db.listCollections().toArray()).map(c => c.name));
    
  } catch (err) {
    console.error('❌ Error de conexión:', err.message);
    
    if (err.reason) {
      console.error('Motivo:', err.reason);
    }
    process.exit(1);
  }
};
module.exports = connectDB;