// services/reservation.service.js
// const ReservationModel = require('../models/reservation.model');
// const BookModel = require('../models/book.model');
const { RoomAvailableModel, BookModel, ReservationModel } = require('../../model/index.model');
const reminderQueue = require('../../3rdParty/Emails/remainder.queue');
class ReservationService {
//   async createReservation(reservationData) {
//     if (reservationData.type === 'book') {
//       const book = await BookModel.findById(reservationData.book);
//       if (book.availableCopies < 1) throw new Error('No available copies');
//     } else {
//       const slot = await RoomAvailableModel.findById(reservationData.roomSlot);
//       if (!slot.isAvailable) throw new Error('Slot not available');
//       slot.isAvailable = false;
//       await slot.save();
//       reservationData.roomStart = slot.startDateTime;
//       reservationData.roomEnd = slot.endDateTime;
//     }
//     return ReservationModel.create(reservationData);
//   }

//   async updateReservationStatus(id, status, userRole) {
//     const reservation = await ReservationModel.findById(id);

//     if (['approved', 'declined'].includes(status) && userRole !== '1') {
//       throw new Error('Unauthorized status change');
//     }

//     if (status === 'approved' && reservation.type === 'book') {
//       const book = await BookModel.findById(reservation.book);
//       book.availableCopies -= 1;
//       await book.save();
//     }

//     reservation.status = status;
//     return reservation.save();
//   }



  async createReservation(reservationData) {
    let reservation;
    
    if (reservationData.type === 'book') {
      const book = await BookModel.findById(reservationData.book);
      if (book.availableCopies < 1) throw new Error('No available copies');
      
      reservation = await ReservationModel.create(reservationData);
    } else {
      const slot = await RoomAvailableModel.findById(reservationData.roomSlot);
      if (!slot || !slot.isAvailable) throw new Error('Slot not available');
      
      slot.isAvailable = false;
      await slot.save();
      
      reservationData.roomStart = slot.startDateTime;
      reservationData.roomEnd = slot.endDateTime;
      reservation = await ReservationModel.create(reservationData);
    }

    return reservation;
  }

  async updateReservationStatus(id, status, userRole) {
    const reservation = await ReservationModel.findById(id);
    
    if (['approved', 'declined'].includes(status) && userRole !== '1') {
      throw new Error('Unauthorized status change');
    }

    console.log(reservation,"reservation",status,"status")
    // Status transition logic
    const originalStatus = reservation.status;
    reservation.status = status;
    
    // Book availability update
    if (status === 'approved' && reservation.type === 'book') {
      const book = await BookModel.findById(reservation.book);
      book.availableCopies -= 1;
      await book.save();
    }

    // Schedule reminders on approval
    if (status === 'approved' && originalStatus !== 'approved') {
      await this.scheduleReminder(reservation);
    }

    // Handle returns/releases
    if (status === 'returned' && reservation.type === 'book') {
      const book = await BookModel.findById(reservation.book);
      book.availableCopies += 1;
      await book.save();
    }

    if (status === 'completed' && reservation.type === 'room') {
      const slot = await RoomAvailableModel.findById(reservation.roomSlot);
      slot.isAvailable = true;
      await slot.save();
    }

    await reservation.save();
    return reservation;
  }

  async scheduleReminder(reservation) {
    try {
      let reminderTime;
      
      if (reservation.type === 'book') {
        // Set reminder 1 day before pickup
        reminderTime = new Date(reservation.pickupDate);
        reminderTime.setDate(reminderTime.getDate() - 1);
      } else {
        // Set reminder 1 day before room slot
        reminderTime = new Date(reservation.roomStart);
        reminderTime.setDate(reminderTime.getDate() - 1);
      }

      // Schedule only if reminder is in the future
      console.log("yes")
      if (reminderTime > new Date()) {
        const delay = reminderTime - Date.now();
        
      let idD=  await reminderQueue.add(
          `reminder-${reservation._id}`,
          { reservationId: reservation._id },
          { delay:0 }
        );
        // console.log(idD,"Added")
      }
    } catch (error) {
      console.error('Error scheduling reminder:', error);
    }
  }


  async getUserReservations(userId) {
    return ReservationModel.find({ user: userId });
  }

 
  async getAllReservations(filters = {}, sort = {}, page = 1, limit = 10) {
    // Build query
    const query = {};
    if (filters.status) query.status = filters.status;
    if (filters.type) query.type = filters.type;
    if (filters.user) query.user = filters.user;

    // Get total count
    const total = await ReservationModel.countDocuments(query);

    // Get paginated results
    const reservations = await ReservationModel.find(query)
      .populate('user', 'email username')
      .populate('book', 'title author')
      .populate('roomSlot', 'startDateTime endDateTime')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      data: reservations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total
      }
    };
  }

   async markPickedUp(reservationId, userId) {
    const reservation = await ReservationModel.findOne({
      _id: reservationId,
      user: userId,
      type: 'book'
    });
    
    if (!reservation) throw new Error('Reservation not found');
    if (reservation.status !== 'approved') {
      throw new Error('Only approved book reservations can be picked up');
    }
    
    reservation.status = 'checked_out';
    reservation.pickedUpAt = new Date();
    return reservation.save();
  }

  async markCheckedIn(reservationId, userId) {
    const reservation = await ReservationModel.findOne({
      _id: reservationId,
      user: userId,
      type: 'room'
    });
    
    if (!reservation) throw new Error('Reservation not found');
    if (reservation.status !== 'approved') {
      throw new Error('Only approved room reservations can be checked in');
    }
    if (new Date() > reservation.roomEnd) {
      throw new Error('Room slot has already expired');
    }
    
    reservation.status = 'checked_out';
    reservation.checkedInAt = new Date();
    return reservation.save();
  }
}
module.exports = new ReservationService();
