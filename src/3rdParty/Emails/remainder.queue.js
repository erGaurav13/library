const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis({
  host: 'redis-13125.crce179.ap-south-1-1.ec2.redns.redis-cloud.com',
  port: 13125,
  username: 'default',
  password: 'bbWRV2Y5Qi7bAh4mhtgOBcgCxSqFpYK6',
  tls: {} , 
   maxRetriesPerRequest: null
});


const reminderQueue = new Queue('reminderQueue', { connection });

module.exports = reminderQueue;
