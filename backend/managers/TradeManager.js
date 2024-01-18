class TradeManager {
    constructor(sessionClient) {
      this.sessionClient = sessionClient;
    }
  
    async getTradeState(sessionId) {
      const tradeStateJson = await this.sessionClient.get(sessionId);
      if (tradeStateJson) {
        return JSON.parse(tradeStateJson);
      } else {
        return null;
      }
    }
  
    async addToTrade(sessionId, tradeState) {
      await this.sessionClient.set(sessionId, JSON.stringify(tradeState));
      return tradeState;
    }
  
    async pendingTradeAcceptance(tradeSessionId, playerId) {
      // Retrieve the current trade session state
      let tradeStateJson = await this.sessionClient.get(tradeSessionId);
      let tradeSession = tradeStateJson ? JSON.parse(tradeStateJson) : {};
      // console.log("tradeSessionId", tradeSessionId);
      // console.log("tradeStateJson:", tradeStateJson);
      // Initialize acceptedPlayers if it doesn't exist
      tradeSession.acceptedPlayers = tradeSession.acceptedPlayers || {};
  
      // Update the acceptance status of the current player
      tradeSession.acceptedPlayers[playerId] = true;
  
      // Save the updated trade session
      await this.sessionClient.set(tradeSessionId, JSON.stringify(tradeSession));
  
      // Retrieve and log the updated trade session for debugging
      let updatedTradeStateJson = await this.sessionClient.get(tradeSessionId);
      let updatedTradeSession = JSON.parse(updatedTradeStateJson);
  
      // Check if both players have accepted the trade
      return Object.keys(updatedTradeSession.acceptedPlayers).length === 2;
    }
    async resetTradeSession(tradeSessionId) {
      // Resetting the trade session state
      // This assumes that an empty object `{}` represents the reset state
      await this.sessionClient.set(tradeSessionId, JSON.stringify({}));

      console.log(`Trade session ${tradeSessionId} has been reset.`);
    }
    processTradeItems(
      player1Inventory,
      player2Inventory,
      player1EquipmentItems,
      player2EquipmentItems,
      player1TreasureItems,
      player2TreasureItems,
      player1Resources,
      player2Resources
    ) {
      // Assuming player1TradeItems and player2TradeItems are arrays of equipment objects
      player1Inventory.equipment = player1Inventory.equipment
        .filter(
          (item) =>
            !player1EquipmentItems.some(
              (tradeItem) => tradeItem.equipmentName === item.equipmentName
            )
        )
        .concat(player2EquipmentItems);
  
      player2Inventory.equipment = player2Inventory.equipment
        .filter(
          (item) =>
            !player2EquipmentItems.some(
              (tradeItem) => tradeItem.equipmentName === item.equipmentName
            )
        )
        .concat(player1EquipmentItems);
  
      player1Inventory.treasures = player1Inventory.treasures
        .filter(
          (item) =>
            !player1TreasureItems.some(
              (tradeItem) => tradeItem.treasureName === item.treasureName
            )
        )
        .concat(player2TreasureItems);
  
        player2Inventory.treasures = player2Inventory.treasures
        .filter(
          (item) =>
            !player2TreasureItems.some(
              (tradeItem) => tradeItem.treasureName === item.treasureName
            )
        )
        .concat(player1TreasureItems); 
      // Update resources for both players
      player1Inventory.resources =
        player1Inventory.resources - player1Resources + player2Resources;
      player2Inventory.resources =
        player2Inventory.resources - player2Resources + player1Resources;
    }
  
    async finalizeTrade(tradeSessionId, sessionId) {
      const tradeStateJson = await this.sessionClient.get(tradeSessionId);
      const sessionData = JSON.parse(await this.sessionClient.get(sessionId));
      let tradeSession = tradeStateJson ? JSON.parse(tradeStateJson) : {};
      console.log("tradeSession from Finzlize Trade:", tradeSession)
      if (
        tradeSession.acceptedPlayers &&
        Object.keys(tradeSession.acceptedPlayers).length === 2
      ) {
        const [player1Id, player2Id] = Object.keys(tradeSession).filter(
          (key) => key !== "acceptedPlayers"
        );
       
        const player1Trade = tradeSession[player1Id];
        const player2Trade = tradeSession[player2Id];
  
        const player1 = sessionData.players.find((p) => p.username === player1Id);
        const player2 = sessionData.players.find((p) => p.username === player2Id);
  
        if (!player1 || !player2) {
          console.error("Players not found in session data");
          return;
        }
  
        try {
          // Swap equipment
          console.log("Player1Inv preprocess:", player1.inventory);
          this.processTradeItems(
            player1.inventory,
            player2.inventory,
            player1Trade.equipment,
            player2Trade.equipment,
            player1Trade.treasures,
            player2Trade.treasures,
            player1Trade.resources,
            player2Trade.resources
          );
          console.log("Player1Inv postprocessing: ", player1.inventory);
          console.log("SessionData: ", sessionData.players);
          // Update the game state in the database
          await this.sessionClient.set(sessionId, JSON.stringify(sessionData));
  
          // Reset the trade session
          await this.sessionClient.set(tradeSessionId, JSON.stringify({}));
  
          return sessionData;
          // Commit transaction here if your database supports it
        } catch (error) {
          // Rollback transaction here if your database supports it
          console.error("Error processing trade:", error);
        }
      } else {
        console.error("Trade session not ready or missing", tradeSession);
      }
    }
   
  }

  module.exports = TradeManager;