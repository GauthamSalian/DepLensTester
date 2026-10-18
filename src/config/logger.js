const chalk = require('chalk');

const formatTime = () => new Date().toISOString();

const logger = {
  info: (msg) => {
    console.log(`[${formatTime()}] ${chalk.blue('INFO')}: ${msg}`);
  },
  warn: (msg) => {
    console.warn(`[${formatTime()}] ${chalk.yellow('WARN')}: ${msg}`);
  },
  error: (msg) => {
    console.error(`[${formatTime()}] ${chalk.red('ERROR')}: ${msg}`);
  },
  debug: (msg) => {
    if (process.env.DEBUG || process.env.NODE_ENV === 'development') {
      console.log(`[${formatTime()}] ${chalk.gray('DEBUG')}: ${msg}`);
    }
  }
};

module.exports = logger;
