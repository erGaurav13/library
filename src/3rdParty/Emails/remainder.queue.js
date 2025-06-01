// queues/reminder.queue.js
const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

const reminderQueue = new Queue('reminderQueue', { connection });

module.exports = reminderQueue;