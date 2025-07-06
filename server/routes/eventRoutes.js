const express = require('express');
const {
  createEvent,
  getAllEvents,
  createEventWithImages,
  updateEvent,
  deleteEvent,
  removeDescriptionImage,
  removeCoverImage
} = require('../controllers/eventController');

const router = express.Router();

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

router.post('/', createEvent);
router.get('/', getAllEvents);

router.post(
  '/with-images',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'descriptionImages', maxCount: 10 },
  ]),
  createEventWithImages
);

router.put(
  '/:id',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'descriptionImages', maxCount: 10 },
  ]),
  updateEvent
);

router.delete('/:id', deleteEvent);

router.put('/:id/remove-description-image', removeDescriptionImage);
router.put('/:id/remove-cover', removeCoverImage);
 
module.exports = router;
