const log4js = require('log4js');

const logger = () => {
  const dir = process.env.NODE_LOG_DIR !== undefined ? process.env.NODE_LOG_DIR : '.';
  
  const config = {
    appenders: {
      everything: {
        type: 'file',
        filename: `${dir}/application.log`,
        pattern: '-yyyy-MM-dd',
        layout: {
          type: 'pattern',
          pattern: '%d (PID %x{pid}) %p %c - %m',
          tokens: {
            pid: () => { return process.pid; }
          }
        }
      }
    },
    categories: {
      default: {
        appenders: ['everything'],
        level: 'debug'
      }
    }
  };

  log4js.configure(config);

  return {
    getLogger: (category) => log4js.getLogger(category)
  };
};

module.exports = logger;
