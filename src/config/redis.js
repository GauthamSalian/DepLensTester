const EventEmitter = require('events');
const logger = require('./logger');

class MemoryCacheClient extends EventEmitter {
  constructor() {
    super();
    this.store = new Map();
    process.nextTick(() => this.emit('connect'));
  }

  async get(key) {
    return this.store.get(key) || null;
  }

  async set(key, value) {
    this.store.set(key, value);
    return 'OK';
  }

  async del(key) {
    return this.store.delete(key) ? 1 : 0;
  }
}

const redisClient = new MemoryCacheClient();

redisClient.on('connect', () => {
  logger.info('Cache client initialized');
});

module.exports = redisClient;
