const mongoose = require('mongoose');

const ModelSchema = new mongoose.Schema({
  modelId: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      // Genera un ID como "CFX-765220"
      return `CFX-${Math.floor(100000 + Math.random() * 900000)}`;
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Por favor proporcione ID de usuario']
  },
  modelFileName: {
    type: String,
    required: [true, 'Por favor ingrese nombre de archivo']
  },
  modelName: {
    type: String,
    required: [true, 'Por favor ingrese nombre del modelo'],
    trim: true
  },
  generatedTokens: {
    type: Number,
    default: 0
  },
  modelStatus: {
    type: Boolean,
    default: false
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true 
});

ModelSchema.index({ userId: 1, modelStatus: 1 });

module.exports = mongoose.models.Model || mongoose.model('Model', ModelSchema);