// services/room.service.js
const {RoomsModel ,RoomAvailableModel}= require('../../model/index.model');
 
class RoomService {
  async createRoom(roomData) {
    return RoomsModel.create(roomData);
  }

  async getRooms() {
    return RoomsModel.find();
  }

  async createSlot(slotData) {
    const slot = await RoomAvailableModel.create(slotData);
    return slot.populate('room');
  }

  async getAvailableSlots(roomId) {
    return RoomAvailableModel.find({ 
      room: roomId,
      isAvailable: true 
    }).populate('room');
  }
}

module.exports = new RoomService();