const minimist = require('minimist');

/**
 * Parse CLI arguments using minimist
 * @param {Array<string>} rawArgs - process.argv.slice(2)
 */
const parseCliArgs = (rawArgs = process.argv.slice(2)) => {
  const options = {
    string: ['port', 'env', 'config'],
    boolean: ['debug', 'help', 'version'],
    alias: {
      p: 'port',
      e: 'env',
      d: 'debug',
      h: 'help',
      v: 'version'
    },
    default: {
      port: '3000',
      env: 'development',
      debug: false
    }
  };

  const parsed = minimist(rawArgs, options);
  return {
    port: parseInt(parsed.port, 10) || 3000,
    env: parsed.env,
    debug: parsed.debug,
    showHelp: parsed.help,
    showVersion: parsed.version,
    remainingArgs: parsed._
  };
};

module.exports = {
  parseCliArgs
};
