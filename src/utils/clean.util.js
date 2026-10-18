const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

/**
 * Clean temporary files and upload directories using native fs methods
 */
const cleanTempDirs = async () => {
  const dirs = [
    path.join(process.cwd(), 'uploads'),
    path.join(process.cwd(), 'logs')
  ];

  for (const dir of dirs) {
    try {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          fs.rmSync(path.join(dir, file), { recursive: true, force: true });
        }
        logger.info(`Cleaned directory contents: ${dir}`);
      }
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
