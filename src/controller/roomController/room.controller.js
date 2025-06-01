// controllers/room.controller.js
const roomService = require('./room.service');

class RoomController {
  async createRoom(req, res) {
    try {
      if (req.user.role !== '1') throw new Error('Forbidden');
      const room = await roomService.createRoom(req.body);
      res.status(201).json(room);
    } catch (err) {
      res.status(403).json({ error: err.message });
    }
  }

  async getRooms(req, res) {
    try {
      const rooms = await roomService.getRooms();
      res.status(200).json(rooms);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createSlot(req, res) {
    try {
      if (req.user.role !== '1') throw new Error('Forbidden');
      const slot = await roomService.createSlot(req.body);
      res.status(201).json(slot);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getAvailableSlots(req, res) {
    try {
      const slots = await roomService.getAvailableSlots(req.params.roomId);
      res.status(200).json(slots);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new RoomController();
