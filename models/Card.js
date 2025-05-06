const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  bannerUrl: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  charts: Array
});

module.exports = mongoose.model('Card', cardSchema);
