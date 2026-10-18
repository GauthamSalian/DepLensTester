const Redis = require('ioredis');
const logger = require('./logger');

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

const redisClient = new Redis({
  host: redisHost,
  port: redisPort,
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  retryStrategy(times) {
    if (times > 3) {
      return null; // Stop retrying in dev/test environment
    }
    return Math.min(times * 100, 2000);
  }
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis server');
});

redisClient.on('error', (err) => {
  logger.warn(`Redis client notice: ${err.message}`);
});

module.exports = redisClient;
