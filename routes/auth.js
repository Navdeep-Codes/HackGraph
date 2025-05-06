const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const base = require('../airtable');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password, code } = req.body;

  let valid = false;
  await base('AdminCodes').select().eachPage((records, fetchNextPage) => {
    records.forEach(record => {
      if (record.fields.Code === code) valid = true;
    });
    console.log("hsff")
    fetchNextPage();
  });

  if (!valid) return res.send('Invalid Airtable Code');

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ name, email, password: hashedPassword, airtableCode: code });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie('token', token).redirect('/cards/create');
  } catch (err) {
    res.send('Signup Failed');
  }
});

module.exports = router;
