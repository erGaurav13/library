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
      if (req.user.role !== '1') throw new Error('Forbidden');
      
      // Get query parameters
      const { 
        page = 1, 
        limit = 10, 
        sort = 'createdAt:-1', 
        status, 
        type 
      } = req.query;

      // Parse sort parameter (format: "field:direction")
      const sortOptions = {};
      if (sort) {
        const [field, direction] = sort.split(':');
        sortOptions[field] = direction === 'desc' ? -1 : 1;
      }

      // Get reservations
      const result = await reservationService.getAllReservations(
        { status, type }, 
        sortOptions, 
        parseInt(page), 
        parseInt(limit)
      );

      return res.status(200).json(result);
    } catch (err) {
     return res.status(403).json({ error: err.message });
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

    async markPickedUp(req, res) {
    try {
      const reservation = await reservationService.markPickedUp(
        req.params.id,
        req.user.id
      );
      res.status(200).json(reservation);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async markCheckedIn(req, res) {
    try {
      const reservation = await reservationService.markCheckedIn(
        req.params.id,
        req.user.id
      );
      res.status(200).json(reservation);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
module.exports = new ReservationController();