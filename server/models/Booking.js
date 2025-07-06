const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  qrCode: String, // صورة QR base64
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
