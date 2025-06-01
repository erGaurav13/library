// models/reservation.model.js
const mongoose = require('mongoose');
const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['book', 'room'],
      required: true,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'approved',
        'declined',
        'checked_out',
        'returned',
        'completed',
        'cancelled',
      ],
      default: 'pending',
    },
    // Book fields
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    pickupDate: Date,
    pickedUpAt:Date,
    dueDate: Date,
    returnedDate: Date,
    // Room fields
    roomSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'RoomAvailableSlot' },
    roomStart: Date,
    roomEnd: Date,

  },
  { timestamps: true },
);
module.exports = mongoose.model('Reservation', reservationSchema);
