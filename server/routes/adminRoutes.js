const express = require('express');
const router = express.Router();
const {
  getEventStats,
  getUserStats,
  getBookingStats,
  getAllStats,
  getRecentEvents
} = require('../controllers/adminStatsController');


router.get('/stats/events', getEventStats);
router.get('/stats/users', getUserStats);
router.get('/stats/bookings', getBookingStats);
router.get('/stats', getAllStats); 
router.get('/recent-events', getRecentEvents);

module.exports = router;
