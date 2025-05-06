const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  airtableCode: String
});

module.exports = mongoose.model('User', userSchema);
