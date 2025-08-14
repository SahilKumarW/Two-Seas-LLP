const express = require('express');
const multer = require('multer');
const { storage } = require('../firebase-admin'); // Your Firebase Admin setup

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const bucket = storage.bucket();
    const file = bucket.file(`assessments/${Date.now()}_${req.file.originalname}`);
    
    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype }
    });
    
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491' // Far future date
    });
    
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});