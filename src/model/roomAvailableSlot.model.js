// models/roomAvailableSlot.model.js
const mongoose = require('mongoose');
const slotSchema = new mongoose.Schema({
  room: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Room', 
    required: true 
  },
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('RoomAvailableSlot', slotSchema);