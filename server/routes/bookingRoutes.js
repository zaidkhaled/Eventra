const express = require('express');
const { createBooking, getAllBookings, deleteBooking, getBookingsByUser } = require('../controllers/bookingController');

const authenticateUser = require('../middleware/authenticateUser');


const router = express.Router();

router.post('/', createBooking); // إنشاء حجز
router.get('/', getAllBookings); // عرض كل الحجوزات (للأدمن لاحقًا)
router.delete('/:id', deleteBooking);
router.post('/', authenticateUser, createBooking); // يجب تسجيل الدخول للحجز
router.get('/user/:userId', getBookingsByUser);

module.exports = router;
