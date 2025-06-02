// services/room.service.js
const { RoomsModel, RoomAvailableModel } = require('../../model/index.model');

class RoomService {
  async createRoom(roomData) {
    return RoomsModel.create(roomData);
  }

   async getRooms(search = '', sort = {}, page = 1, limit = 10) {
    // Build search query
    const query = {};
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { location: searchRegex }
      ];
    }
    
    // Get total count
    const total = await RoomsModel.countDocuments(query);
    
    // Get paginated results
    const rooms = await RoomsModel.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);
    
    return {
      data: rooms,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total
      }
    };
  }

  async createSlot(slotData) {
    const slot = await RoomAvailableModel.create(slotData);
    return slot.populate('room');
  }

  async getAvailableSlots(roomId) {
    return RoomAvailableModel.find({
      room: roomId,
      isAvailable: true,
    }).populate('room');
  }

  async getRoomById(id) {
    return RoomsModel.findById(id);
  }

  async updateRoom(id, updateData) {
    // Prevent updating protected fields
    const protectedFields = ['_id', 'createdAt', 'updatedAt'];
    protectedFields.forEach((field) => delete updateData[field]);

    // Check if name is being updated to a value that already exists
    if (updateData.name) {
      const existingRoom = await RoomsModel.findOne({
        name: updateData.name,
        _id: { $ne: id },
      });

      if (existingRoom) {
        throw new Error('Room name already exists');
      }
    }

    // Validate capacity
    if (updateData.capacity && updateData.capacity < 1) {
      throw new Error('Capacity must be at least 1');
    }

    return RoomsModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }
}

module.exports = new RoomService();
