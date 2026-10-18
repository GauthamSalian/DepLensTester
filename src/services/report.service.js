const moment = require('moment');
const dayjs = require('dayjs');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

/**
 * Format timestamp using moment.js
 */
const formatWithMoment = (date = new Date(), pattern = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(date).utc().format(pattern);
};

/**
 * Calculate duration between two dates using moment
 */
const getDurationHumanized = (startDate, endDate = new Date()) => {
  const start = moment(startDate);
  const end = moment(endDate);
  const diffMs = end.diff(start);
  return moment.duration(diffMs).humanize();
};

/**
 * Manipulate dates using dayjs
 */
const getExpirationDate = (daysFromNow = 30) => {
  return dayjs().add(daysFromNow, 'day').format('YYYY-MM-DD');
};

/**
 * Generate URL-friendly slug from title using slugify
 */
const generateSlug = (title) => {
  if (!title) return '';
  return slugify(title, {
    lower: true,
    strict: true,
    trim: true
  });
};

/**
 * Scan workspace directory for specific file patterns
 */
const findSourceFiles = (pattern = '**/*.js') => {
  try {
    const cwd = path.join(__dirname, '..');
    const scanDir = (dir) => {
      let results = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name !== 'node_modules' && entry.name !== '.git') {
            results = results.concat(scanDir(fullPath));
          }
        } else if (entry.name.endsWith('.js')) {
          results.push(path.relative(cwd, fullPath));
        }
      }
      return results;
    };

    const files = scanDir(cwd);
    logger.debug(`Found ${files.length} files matching ${pattern}`);
    return files;
  } catch (error) {
    logger.error(`Source scanning failed: ${error.message}`);
    return [];
  }
};

/**
 * Build consolidated report object
 */
const buildSummaryReport = (title, data = {}) => {
  const slug = generateSlug(title);
  const generatedAtMoment = formatWithMoment();
  const expiresAtDayjs = getExpirationDate(14);
  const relatedFiles = findSourceFiles('**/*.js');

  return {
    title,
    slug,
    generatedAt: generatedAtMoment,
    expiresAt: expiresAtDayjs,
    durationActive: getDurationHumanized(moment().subtract(2, 'hours')),
    scannedFilesCount: relatedFiles.length,
    scannedFilesSample: relatedFiles.slice(0, 5),
    metadata: data
  };
};

module.exports = {
  formatWithMoment,
  getDurationHumanized,
  getExpirationDate,
  generateSlug,
  findSourceFiles,
  buildSummaryReport
};
