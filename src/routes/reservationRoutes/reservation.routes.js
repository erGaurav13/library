const express = require('express');
const router = express.Router();

const { reservcationController } = require('../../controller/index.controller');
const { auth } = require('../../middleware/index.middleware');

// Book routes

// Reservation routes
router.post('/reservations', auth, reservcationController.createReservation);
router.get('/reservations', auth, reservcationController.getUserReservations);
router.get('/reservations/all', auth, reservcationController.getAllReservations);
router.patch('/reservations/:id/status', auth, reservcationController.updateStatus);

router.patch('/reservations/:id/checkout', auth, reservcationController.markPickedUp);
router.patch('/reservations/:id/checkin', auth, reservcationController.markCheckedIn);


module.exports = router;
