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

   async getRoomById(req, res) {
    try {
      const room = await roomService.getRoomById(req.params.id);
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      res.status(200).json(room);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new RoomController();
