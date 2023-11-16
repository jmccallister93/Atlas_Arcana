const Player = require('../database/PlayerModel')

module.exports = {
validatePlayerRegistration: async (playerData) => {
    // Check for email
    if (!playerData.email || typeof playerData.email !== 'string') {
      return { valid: false, message: 'Invalid email format' };
    }

    // Simple regex for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(playerData.email)) {
      return { valid: false, message: 'Invalid email format' };
    }

    // Check if email already exists in the database
    const emailExists = await Player.findOne({ email: playerData.email });
    if (emailExists) {
      return { valid: false, message: 'Email already exists' };
    }

    // Check for username
    if (!playerData.username || typeof playerData.username !== 'string') {
      return { valid: false, message: 'Invalid username format' };
    }

    // Check if username already exists in the database
    const usernameExists = await Player.findOne({ username: playerData.username });
    if (usernameExists) {
      return { valid: false, message: 'Username already exists' };
    }

    // Additional validations can be added here

    return { valid: true };
  }
};
