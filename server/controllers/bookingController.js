const Booking = require('../models/Booking');
const Event = require('../models/Event');
const QRCode = require('qrcode');

// exports.createBooking = async (req, res) => {
//   const { userId, eventId } = req.body;

//   try {
//     const event = await Event.findById(eventId);
//     if (!event) return res.status(404).json({ message: 'Event not found' });

//     const bookingData = `${userId}-${eventId}-${Date.now()}`;
//     const qrCodeImage = await QRCode.toDataURL(bookingData);

//     const booking = await Booking.create({
//       user: userId,
//       event: eventId,
//       qrCode: qrCodeImage
//     });

//     res.status(201).json(booking);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



exports.createBooking = async (req, res) => {
  const { userId, eventId } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // ✅ تحقق هل هذا المستخدم حجز هذا الحدث سابقًا
    const existingBooking = await Booking.findOne({ user: userId, event: eventId });
    if (existingBooking) {
      return res.status(400).json({ message: 'You already booked this event' });
    }

    const bookingData = `${userId}-${eventId}-${Date.now()}`;
    const qrCodeImage = await QRCode.toDataURL(bookingData);

    const booking = await Booking.create({
      user: userId,
      event: eventId,
      qrCode: qrCodeImage
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getBookingsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const bookings = await Booking.find({ user: userId }).populate('event');
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user event');
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
