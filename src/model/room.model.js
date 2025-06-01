// models/room.model.js
const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  description: String,
  location: String
}, { timestamps: true });
module.exports = mongoose.model('Room', roomSchema);