const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  const { title, description, date, location, image } = req.body;

  try {
    const newEvent = await Event.create({ title, description, date, location, image });
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// لإنشاء حدث مع صورة الغلاف
// exports.createEventWithImage = async (req, res) => {
//   const { title, description, location, date } = req.body;

//   if (!req.file) {
//     return res.status(400).json({ message: 'Cover image is required' });
//   }

//   try {
//     const imageBuffer = req.file.buffer;
//     const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;

//     const newEvent = await Event.create({
//       title,
//       description,
//       location,
//       date,
//       image: base64Image,
//     });

//     res.status(201).json(newEvent);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// exports.createEventWithImages = async (req, res) => {
//   try {
//     const { title, description, location, date } = req.body;

//     if (!req.files || !req.files.image) {
//       return res.status(400).json({ message: 'Cover image is required' });
//     }

//     const descriptionImages = req.files.descriptionImages || [];

//     if (descriptionImages.length > 10) {
//       return res.status(400).json({ message: 'You can upload a maximum of 10 description images.' });
//     }

//     const coverImage = `https://eventra-rhna.onrender.com/uploads/${req.files.image[0].filename}`;

//     const descriptionImageUrls = descriptionImages.map(
//       (file) => `https://eventra-rhna.onrender.com/uploads/${file.filename}`
//     );

//     const event = new Event({
//       title,
//       description,
//       location,
//       date,
//       image: coverImage,
//       descriptionImages: descriptionImageUrls,
//     });

//     await event.save();
//     res.status(201).json(event);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };








exports.createEventWithImages = async (req, res) => {
  try {
    const { title, description, location, date, image, descriptionImages } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'Cover image is required' });
    }

    if (descriptionImages?.length > 10) {
      return res.status(400).json({ message: 'You can upload a maximum of 10 description images.' });
    }

    const event = new Event({
      title,
      description,
      location,
      date,
      image, // هذا رابط الصورة من Cloudinary
      descriptionImages, // هذه مصفوفة روابط الصور من Cloudinary
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message });
  }
};



















// exports.updateEvent = async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     if (!event) return res.status(404).json({ message: 'Event not found' });

//     const { title, description, location, date } = req.body;

//     if (title) event.title = title;
//     if (description) event.description = description;
//     if (location) event.location = location;
//     if (date) event.date = date;

//     // تحديث صورة الغلاف إن وجدت
//     if (req.files?.image?.[0]) {
//       event.image = `https://eventra-rhna.onrender.com/uploads/${req.files.image[0].filename}`;
//     }

//     // تحديث صور الوصف
//     if (req.files?.descriptionImages?.length) {
//       const newImages = req.files.descriptionImages.map(
//         (file) => `https://eventra-rhna.onrender.com/uploads/${file.filename}`
//       );

//       const currentImagesCount = event.descriptionImages?.length || 0;
//       const totalAfterUpdate = currentImagesCount + newImages.length;

//       if (totalAfterUpdate > 10) {
//         return res.status(400).json({
//           message: 'Total description images cannot exceed 10.',
//         });
//       }

//       event.descriptionImages = [...event.descriptionImages, ...newImages];
//     }

//     await event.save();
//     res.status(200).json(event);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };







exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const { title, description, location, date, image, newDescriptionImages } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (location) event.location = location;
    if (date) event.date = date;

    if (image) {
      event.image = image; // رابط صورة من Cloudinary
    }

    if (newDescriptionImages?.length) {
      const currentImagesCount = event.descriptionImages?.length || 0;
      const totalAfterUpdate = currentImagesCount + newDescriptionImages.length;

      if (totalAfterUpdate > 10) {
        return res.status(400).json({
          message: 'Total description images cannot exceed 10.',
        });
      }

      event.descriptionImages = [...event.descriptionImages, ...newDescriptionImages];
    }

    await event.save();
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};











exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.removeDescriptionImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.descriptionImages = event.descriptionImages.filter((img) => img !== imageUrl);
    await event.save();

    res.status(200).json({ descriptionImages: event.descriptionImages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.removeCoverImage = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.image = '';
    await event.save();

    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
