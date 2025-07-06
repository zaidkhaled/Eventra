const Event = require('../models/Event');
const User = require('../models/User');
const Booking = require('../models/Booking'); // إذا لم يكن موجودًا الآن، سنتعامل معه لاحقًا

exports.getEventStats = async (req, res) => {
  try {
    const count = await Event.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBookingStats = async (req, res) => {
  try {
    const count = await Booking.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllStats = async (req, res) => {
  try {
    const [users, events, bookings] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Booking.countDocuments(),
    ]);

    res.json({ users, events, bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getRecentEvents = async (req, res) => {
  try {
    const recentEvents = await Event.find().sort({ createdAt: -1 }).limit(5);
    res.json(recentEvents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
