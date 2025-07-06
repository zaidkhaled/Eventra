const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  date: {
    type: Date,
    required: true,
  },
  location: String,
  image: String, // رابط صورة
  descriptionImages: [String],
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
