const CardManager = require('./CardManager');
const MapManager = require('./MapManager'); // Assuming you have a MapManager
const PlayerManager = require('./PlayerManager'); // Assuming you have a PlayerManager
const TradeManager = require('./TradeManager'); // Assuming you have a TradeManager
const TurnManager = require('./TurnManager')
const { v4: uuidv4 } = require('uuid');
const sessionClient = require("../yourPathTo/redisClient"); // Import your Redis client

class GameSessionManager {
    constructor() {
        this.cardManager = new CardManager();
        this.mapManager = new MapManager();
        this.playerManager = new PlayerManager();
        this.tradeManager = new TradeManager();
        this.turnManager = new TurnManager()
    }

    async createGameSession(playerOneData, playerTwoData) {
        const sessionId = uuidv4();
        // Initialize players with more detailed data
        const players = this.playerManager.initializePlayers([playerOneData, playerTwoData]);
        // Determine random turn order
        const turnOrder = this.turnManager.determineTurnOrder(players.map(p => p.username));
        // Set starting phase of the game
        const currentPhase = "Map";
        //Determine starting cards
        const startingCardData = this.cardManager.determineStartingCards(players);
        // GameBoard
        // Create tile grid to be sent to the front end
        this.mapManager.createTileGrid();
        //Titans
        const titans = determineStartingTitans(titanCards, players.length);
        const titanPosition = placeTitansOnGrid(gridSize, titans);
      
        // NewSession to pass
        const newSession = {
          sessionId,
          players,
          turnOrder,
          currentPlayerTurn,
          tileGrid,
          setupPhase: true,
          currentPhase,
          turnsCompleted: 1,
          titans: titanPosition,
          equipmentCardCount: startingCardData.chosenEquipmentCards, // Counter for equipment cards
          questCardCount: [], // Counter for quest cards
          treasureCardCount: [],
          worldEventCardCount: [], // Counter for world event cards
        };
        console.log(
          "createGameSession - New session created:",
          JSON.stringify(newSession)
        );
        await sessionClient.set(sessionId, JSON.stringify(newSession));
        return newSession;
      }

    //   Update game state
    async  updateGameState(io, sessionId, newState){
      try {
        const sessionData = JSON.parse(await sessionClient.get(sessionId));
        if (!sessionData) {
          throw new Error("Session not found");
        }
        console.log("Existing GameState before merge:", sessionData.gameState);
        console.log("NewState to merge:", JSON.stringify(newState));
    
        const updatedGameState = { ...sessionData.gameState, ...newState };
        console.log("Updated GameState after merge:", updatedGameState);
    
        sessionData.gameState = updatedGameState;
        await sessionClient.set(sessionId, JSON.stringify(sessionData));
    
        console.log("Emitting updated game state to session:", sessionId);
        io.to(sessionId).emit("updateGameState", updatedGameState);
      } catch (error) {
        console.error("Error updating game state:", error);
      }
    };
    
    async getGameState(sessionId) {
        try {
          const sessionData = await sessionClient.get(sessionId);
          if (sessionData) {
            return JSON.parse(sessionData);
          } else {
            // Handle case where session data is not found
            throw new Error("Session data not found for sessionId: " + sessionId);
          }
        } catch (error) {
          console.error("Error retrieving game state:", error);
          throw error; 
        }
      }

    async endGameSession(sessionId) {
        // Clean up the session data from Redis
        await sessionClient.del(sessionId);
        // Additional logic for saving the game result to database, if required
    }

    // ... other methods related to game session management ...

}

module.exports = GameSessionManager;
