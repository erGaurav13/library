// controllers/reservation.controller.js
const reservationService = require('./reservcation.service');

class ReservationController {
  async createReservation(req, res) {
    try {
        console.log(req.user,"UUU")
      if (req.user.role !== '2') throw new Error('Forbidden');
      const reservation = await reservationService.createReservation({
        ...req.body,
        user: req.user.id
      });
      res.status(201).json(reservation);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getUserReservations(req, res) {
    try {
      const reservations = await reservationService.getUserReservations(req.user.id);
      res.status(200).json(reservations);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getAllReservations(req, res) {
    try {
      if (req.user.role !== 'librarian') throw new Error('Forbidden');
      const reservations = await reservationService.getAllReservations();
      res.status(200).json(reservations);
    } catch (err) {
      res.status(403).json({ error: err.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const reservation = await reservationService.updateReservationStatus(
        req.params.id, 
        status,
        req.user.role
      );
      res.status(200).json(reservation);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
module.exports = new ReservationController();