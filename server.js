const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI);

app.use('/auth', require('./routes/auth'));
app.use('/cards', require('./routes/cards'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/signup.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
