const mongoose = require('mongoose');

const aspirasiSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  judul: {
    type: String,
    required: true
  },
  deskripsi: {
    type: String,
    required: true
  },
  lokasi: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Menunggu', 'Diproses', 'Selesai'],
    default: 'Menunggu'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Aspirasi', aspirasiSchema);
