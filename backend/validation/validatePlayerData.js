module.exports = {
  validatePlayerData: (playerData) => {
    // Check for email
    if (!playerData.email || typeof playerData.email !== 'string') {
      return false;
    }

    // Simple regex for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(playerData.email)) {
      return false;
    }

    // Check for password
    if (!playerData.password || typeof playerData.password !== 'string') {
      return false;
    }

    // Example: Check if the password is at least 6 characters
    // if (playerData.password.length < 6) {
    //   return false;
    // }

    return true;
  }
};
