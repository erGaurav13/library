// workers/reminder.worker.js
const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const {ReservationModel} = require('../../model/index.model');
const emailService = require('./email.service');

const connection = new IORedis({
  host: 'redis-13125.crce179.ap-south-1-1.ec2.redns.redis-cloud.com',
  port: 13125,
  username: 'default',
  password: 'bbWRV2Y5Qi7bAh4mhtgOBcgCxSqFpYK6',
  tls: {} ,// Required for Redis Cloud,
    maxRetriesPerRequest: null 
});

const worker = new Worker('reminderQueue', async job => {
  const { reservationId } = job.data;
  
  try {
    const reservation = await ReservationModel.findById(reservationId)
      .populate('user', 'email')
      .populate('book')
      .populate({
        path: 'roomSlot',
        populate: { path: 'room' }
      });

    if (!reservation || reservation.status !== 'approved') {
      return { success: false, message: 'Reservation not found or not approved' };
    }

    await emailService.sendReminder(reservation.user.email, reservation);
    return { success: true, message: 'Reminder sent' };
  } catch (error) {
    console.error(`Reminder failed for reservation ${reservationId}:`, error);
    throw error;
  }
}, { connection });

console.log('Reminder worker started...');

module.exports = worker;