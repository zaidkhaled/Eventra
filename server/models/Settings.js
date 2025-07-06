const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  isBookingEnabled: {
    type: Boolean,
    default: true,
  },
  areEventsVisible: {
    type: Boolean,
    default: true,
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
