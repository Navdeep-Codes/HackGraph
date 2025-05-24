const express = require('express');
const path = require('path');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Charts page
router.get('/charts', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/charts.html'));
});

module.exports = router;