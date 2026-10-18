const winston = require('winston');
const chalk = require('chalk');

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  const coloredLevel = level === 'error' ? chalk.red(level.toUpperCase()) : chalk.blue(level.toUpperCase());
  return `[${timestamp}] ${coloredLevel}: ${message}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

module.exports = logger;
