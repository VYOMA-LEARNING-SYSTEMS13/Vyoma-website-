const crypto = require('crypto');

function generateUuid() {
  return crypto.randomUUID ? crypto.randomUUID() : 'uuid_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

module.exports = {
  generateUuid
};
