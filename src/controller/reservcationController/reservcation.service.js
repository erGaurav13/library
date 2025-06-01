// services/reservation.service.js
// const ReservationModel = require('../models/reservation.model');
// const BookModel = require('../models/book.model');
const { RoomAvailableModel, BookModel, ReservationModel } = require('../../model/index.model');

class ReservationService {
  async createReservation(reservationData) {
    if (reservationData.type === 'book') {
      const book = await BookModel.findById(reservationData.book);
      if (book.availableCopies < 1) throw new Error('No available copies');
    } else {
      const slot = await RoomAvailableModel.findById(reservationData.roomSlot);
      if (!slot.isAvailable) throw new Error('Slot not available');
      slot.isAvailable = false;
      await slot.save();
      reservationData.roomStart = slot.startDateTime;
      reservationData.roomEnd = slot.endDateTime;
    }
    return ReservationModel.create(reservationData);
  }

  async updateReservationStatus(id, status, userRole) {
    const reservation = await ReservationModel.findById(id);

    if (['approved', 'declined'].includes(status) && userRole !== '1') {
      throw new Error('Unauthorized status change');
    }

    if (status === 'approved' && reservation.type === 'book') {
      const book = await BookModel.findById(reservation.book);
      book.availableCopies -= 1;
      await book.save();
    }

    reservation.status = status;
    return reservation.save();
  }

  async getUserReservations(userId) {
    return ReservationModel.find({ user: userId });
  }

  async getAllReservations() {
    return ReservationModel.find().populate('user', 'email username');
  }
}
module.exports = new ReservationService();
