module.exports = {
    validatePlayerData: (playerData) => {
      if (!playerData.id || typeof playerData.id !== 'string') {
        return false;
      }
      if (!playerData.stats || typeof playerData.stats !== 'object') {
        return false;
      }
      // Additional checks...
      return true;
    }
  };
  