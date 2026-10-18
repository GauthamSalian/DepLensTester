const logger = require('./logger');

// Lightweight in-memory database pool emulator
const memoryStore = new Map();

const query = async (text, params = []) => {
  const start = Date.now();
  logger.debug(`Executed query: ${text} with params: ${JSON.stringify(params)}`);
  const duration = Date.now() - start;
  return {
    rows: Array.from(memoryStore.values()),
    rowCount: memoryStore.size,
    duration
  };
};

module.exports = {
  query,
  memoryStore
};
