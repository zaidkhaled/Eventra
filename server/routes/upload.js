const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary'); // ملف إعداد Cloudinary

const router = express.Router();
const upload = multer({ dest: 'temp/' }); // ملفات مؤقتة

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'eventra_uploads',
      resource_type: 'auto',
    });

    fs.unlinkSync(filePath);

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

module.exports = router;
