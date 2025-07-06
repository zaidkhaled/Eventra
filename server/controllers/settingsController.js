const Settings = require('../models/Settings');

// استدعاء الإعدادات أو إنشاءها تلقائياً إن لم تكن موجودة
const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSetting = async (req, res) => {
  const { key, value } = req.body;

  // خريطة تربط أسماء المفاتيح من الفرونت بالحقول في السكيمة
//   const allowedKeys = {
//     bookingsEnabled: 'isBookingEnabled',
//     eventsVisible: 'areEventsVisible',
//     maintenanceMode: 'maintenanceMode',
//   };

//   const realKey = allowedKeys[key];

//   if (!realKey) {
//     return res.status(400).json({ message: 'Invalid setting key' });
//   }
  try {
    const settings = await getOrCreateSettings();
    settings[req.body.key] = value;
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
