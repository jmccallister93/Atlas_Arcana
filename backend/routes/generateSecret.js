const crypto = require('crypto');

const generateSecret = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

console.log(generateSecret()); // This will output a random 32-byte hex string
