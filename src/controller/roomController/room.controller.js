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
      // Get query parameters
      const { 
        page = 1, 
        limit = 10, 
        search = '',
        sort = 'name:1' 
      } = req.query;
      
      // Parse sort parameter
      const sortOptions = {};
      if (sort) {
        const [field, direction] = sort.split(':');
        sortOptions[field] = direction === 'desc' ? -1 : 1;
      }
      
      // Get paginated rooms
      const result = await roomService.getRooms(
        search,
        sortOptions,
        parseInt(page),
        parseInt(limit)
      );
      
      res.status(200).json(result);
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

   async updateRoom(req, res) {
    try {
      if (req.user.role !== '1') throw new Error('Forbidden');
      
      const updatedRoom = await roomService.updateRoom(
        req.params.id,
        req.body
      );
      
      if (!updatedRoom) {
        return res.status(404).json({ error: 'Room not found' });
      }
      
      res.status(200).json(updatedRoom);
    } catch (err) {
      if (err.message === 'Forbidden') {
        res.status(403).json({ error: err.message });
      } else {
        res.status(400).json({ error: err.message });
      }
    }
  }

  
}

module.exports = new RoomController();
