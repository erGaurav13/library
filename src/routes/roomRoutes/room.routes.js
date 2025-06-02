const express = require('express');
const router = express.Router();

const { RoomController } = require('../../controller/index.controller');
const { auth } = require('../../middleware/index.middleware');

// Room routes
router.post('/rooms', auth, RoomController.createRoom);
router.get('/rooms', auth, RoomController.getRooms);
router.post('/rooms/slots', auth, RoomController.createSlot);
router.get('/rooms/:roomId/slots', auth, RoomController.getAvailableSlots);
// routes.js
router.get('/rooms/:id', auth, RoomController.getRoomById);

module.exports = router;
