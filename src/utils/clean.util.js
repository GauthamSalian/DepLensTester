const { rimraf } = require('rimraf');
const path = require('path');
const logger = require('../config/logger');

/**
 * Clean temporary files and upload directories using rimraf
 */
const cleanTempDirs = async () => {
  const dirs = [
    path.join(process.cwd(), 'uploads', '*'),
    path.join(process.cwd(), 'logs', '*.log')
  ];

  for (const dir of dirs) {
    try {
      await rimraf(dir, { glob: true });
      logger.info(`Cleaned directory: ${dir}`);
    } catch (err) {
      logger.warn(`Failed to clean ${dir}: ${err.message}`);
    }
  }
};

if (require.main === module) {
  cleanTempDirs().then(() => {
    logger.info('Cleanup complete');
  });
}

module.exports = { cleanTempDirs };
