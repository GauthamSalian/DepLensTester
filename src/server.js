require('dotenv').config();
const app = require('./app');
const logger = require('./config/logger');
const { parseCliArgs } = require('./utils/cli.util');

const args = parseCliArgs();
const PORT = process.env.PORT || args.port || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  logger.info(`DepLens Benchmark Server running on http://${HOST}:${PORT}`);
  logger.info(`Environment: ${args.env || process.env.NODE_ENV || 'development'}`);
  logger.info(`Debug mode: ${args.debug ? 'ENABLED' : 'DISABLED'}`);
});

// Graceful shutdown handling
const handleShutdown = (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });

  // Force close if graceful shutdown hangs
  setTimeout(() => {
    logger.error('Force closing server after timeout');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

module.exports = server;
