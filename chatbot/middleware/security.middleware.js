const helmet = require('helmet');

const securityMiddleware = helmet({
  contentSecurityPolicy: false, // Keep false to avoid breaking Vite React frontend when mounted
  crossOriginResourcePolicy: { policy: 'cross-origin' }
});

module.exports = {
  securityMiddleware
};
