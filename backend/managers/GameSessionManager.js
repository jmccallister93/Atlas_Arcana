// Import necessary modules
const redis = require("redis");
const { v4: uuidv4 } = require("uuid");
const io = require("../server/server");

const CardManager = require("../managers/CardManager");
const GameBoardManager = require("../managers/GameBoardManager")
const GameStateManager = require("../managers/GameStateManager")
const PlayerManager = require("../managers/PlayerManager");
const PositionManager = require("../managers/PositionManager");
const TitanManager = require("../managers/TitanManager");
const TradeManager = require("../managers/TradeManager");
const TurnManager = require("../managers/TurnManager");

const equipmentCards = require("../gameCards/equipmentCards");
const elementalCards = require("../gameCards/elementalCards");
const questCards = require("../gameCards/questCards");
const titanCards = require("../gameCards/titanCards");
const treasureCards = require("../gameCards/treasureCards");
const worldEventCards = require("../gameCards/worldEventCards");

// Redis client for session management
const sessionClient = redis.createClient();
sessionClient.on("error", (err) =>
  console.log("Redis Session Client Error", err)
);
sessionClient.connect();

class GameSessionManager {
  constructor() {
    const gridSize = 24; // Define gridSize before using it
    this.sessionClient = sessionClient;
    this.playerManager = new PlayerManager(sessionClient);
    this.gameStateManager = new GameStateManager(sessionClient);
    this.gameBoardManager = new GameBoardManager();
    this.tradeManager = new TradeManager(sessionClient);
    this.titanManager = new TitanManager(titanCards);
    this.turnManager = new TurnManager();
    this.cardManager = new CardManager(equipmentCards);
    this.positionManager = new PositionManager(gridSize);
  }

  async createGameSession(playerOneData, playerTwoData) {
    this.sessionId = uuidv4();
    const players = this.playerManager.initializePlayers([
      playerOneData,
      playerTwoData,
    ]);
    this.turnManager.determineTurnOrder(players);
    const turnOrder = this.turnManager.turnOrder;
    const currentPlayerTurn = this.turnManager.getCurrentPlayerTurn();
    const currentPhase = "Map";
    const startingCardData = this.cardManager.determineStartingCards(players);
    const tileGrid = this.gameBoardManager.createTileGrid();
    const titans = this.titanManager.determineStartingTitans(players.length);
    const titanPositions = this.positionManager.placeTitansOnGrid(titans);
    const newSession = {
      sessionId: this.sessionId,
      players,
      turnOrder,
      currentPlayerTurn,
      tileGrid,
      setupPhase: true,
      currentPhase,
      turnsCompleted: 1,
      titans: titanPositions,
      equipmentCardCount: startingCardData.chosenEquipmentCards, // Counter for equipment cards
      questCardCount: [], // Counter for quest cards
      treasureCardCount: [],
      worldEventCardCount: [], // Counter for world event cards
    };
    await this.sessionClient.set(this.sessionId, JSON.stringify(newSession));
    return newSession;
  }

  async endGameSession(sessionId) {
    // Implementation for ending a game session
  }
}

// Export modules
module.exports = {
  GameSessionManager,
  GameStateManager,
  PlayerManager,
  GameBoardManager,
  TitanManager,
  TradeManager,
};
