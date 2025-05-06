const express = require('express');
const path = require('path');
const multer = require('multer');
const Card = require('../models/Card');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const router = express.Router();
const upload = multer({ dest: 'public/uploads/' });

function authMiddleware(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.redirect('/');
  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) return res.redirect('/');
    req.userId = data.id;
    next();
  });
}

router.get('/create', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/create-card.html'));
});

router.post('/create', authMiddleware, upload.single('banner'), async (req, res) => {
  const { name } = req.body;
  const banner = req.file.filename;

  const existing = await Card.findOne({ name });
  if (existing) return res.send('Card already exists.');

  await Card.create({
    name,
    bannerUrl: `/uploads/${banner}`,
    createdBy: req.userId,
    charts: []
  });

  res.redirect('/cards/dashboard');
});

router.get('/dashboard', authMiddleware, async (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/dashboard.html'));
});

module.exports = router;
