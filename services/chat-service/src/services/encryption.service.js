const crypto = require('crypto');

// Generate a random encryption key
const generateKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Encrypt a message
const encryptMessage = (message) => {
  const key = generateKey();
  const algorithm = 'aes-256-cbc';
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipher(algorithm, key);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    encryptedData: encrypted,
    key: key,
    iv: iv.toString('hex')
  };
};

// Decrypt a message
const decryptMessage = (encryptedMessage, key) => {
  const algorithm = 'aes-256-cbc';
  
  const decipher = crypto.createDecipher(algorithm, key);
  let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

module.exports = {
  encryptMessage,
  decryptMessage
};
