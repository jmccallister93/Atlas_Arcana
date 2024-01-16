//GAME SESSION MANAGER
const equipmentCards = require("../gameCards/equipmentCards");
const elementalCards = require("../gameCards/elementalCards");
const questCards = require("../gameCards/questCards");
const titanCards = require("../gameCards/titanCards");
const treasureCards = require("../gameCards/treasureCards");
const worldEventCards = require("../gameCards/worldEventCards");

const redis = require("redis");
const sessionClient = redis.createClient(); // You can use a separate client for session management
const { v4: uuidv4 } = require("uuid"); // For generating unique session IDs
const io = require("../server/server");
const Player = require("../database/PlayerModel"); // Import the Player model

// Connect to Redis client
sessionClient.on("error", (err) =>
  console.log("Redis Session Client Error", err)
);
sessionClient.connect();

// Create a game session
async function createGameSession(playerOneData, playerTwoData) {
  const sessionId = uuidv4();
  // Initialize players with more detailed data
  const players = initializePlayers([playerOneData, playerTwoData]);
  // Determine random turn order
  const turnOrder = determineTurnOrder(players.map((p) => p.username));
  
  // Set current player turn
  const setCurrentPlayerTurn = (turnOrder) => {
    return turnOrder[0];
  };
  const currentPlayerTurn = setCurrentPlayerTurn(turnOrder);

  // Set starting phase of the game
  const currentPhase = "Map";
  //Determine starting cards
  const startingCardData = determineStartingCards(players);

  // Map object
  const sessionMap = new SessionMap();
    // Example to set initial positions
    players.forEach(player => {
      sessionMap.updatePlayerPosition(player.username, { x: 0, y: 0 });
      // Initialize strongholds, buildings as needed
    });
  
    // Set titan positions
    titans.forEach(titan => {
      sessionMap.updateTitanPosition(titan.titanName, { x: titan.row, y: titan.col });
    });

  // GameBoard
  // Create tile grid to be sent to the front end
  const createTileGrid = () => {
    let gridSize = 24; // 18x18 grid
    const tileGrid = new Array(gridSize)
      .fill(null)
      .map(() => new Array(gridSize).fill(null));
    // Define tile types and their cumulative distribution probabilities
    const tileTypes = [
      { type: "oasis", probability: 0.05 },
      { type: "desert", probability: 0.25 },
      { type: "forest", probability: 0.5 },
      { type: "grassland", probability: 0.75 },
      { type: "tundra", probability: 1.0 },
    ];

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        let randomNum = Math.random();
        let tileType = tileTypes.find(
          (tile) => randomNum <= tile.probability
        ).type;
        tileGrid[i][j] = tileType;
      }
    }

    return tileGrid;
  };

  // Grid
  const tileGrid = createTileGrid();
  const gridSize = 24;

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
// Update the Game State
const updateGameState = async (io, sessionId, newState) => {
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

// Retrieve game state
async function getGameState(sessionId) {
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
    throw error; // Re-throw the error for handling in the calling function
  }
}

// Initialize Player Stats and names
function initializePlayers(playerData) {
  // Create player objects with initial stats, inventory, etc.
  return playerData.map((player) => ({
    socketId: player.socketId,
    id: player.id,
    username: player.username,
    victoryPoints: 0,
    rank: 1,
    totalHealth: 3,
    currentHealth: 3,
    offense: 0,
    defense: 0,
    stamina: 1,
    movement: 3,
    build: 1,
    buildings: [
      {
        category: "",
        type: "",
        position: { row: 0, col: 0 },
        health: 0,
        defense: 0,
        offense: 0,
      },
    ],
    equippedItems: {
      weapon: [],
      armor: [],
      amulet: [],
      boots: [],
      gloves: [],
    },
    equipmentCardCapacity: 5,
    treasureCardCapacity: 5,
    inventory: {
      resources: 4,
      equipment: [],
      treasures: [],
      quests: [],
    },
  }));
}

// Map objects
class SessionMap {
  constructor() {
    this.playerPositions = {};
    this.strongholdPositions = {}
    this.buildingPositions = {}
    this.titanPositions = {}
    this.treasureHoardPositions = {}
  }

  updatePlayerPosition(playerId, coordinates) {
    this.playerPositions[playerId] = coordinates;
  }

  getPlayerPosition(playerId) {
    return this.playerPositions[playerId];
  }

  updateStrongholdPosition(playerId, coordinates) {
    this.strongholdPositions[playerId] = coordinates;
  }

  addBuildingPosition(buildingId, ownerName, coordinates) {
    this.buildingPositions[buildingId] = { ownerName, ...coordinates };
  }

  updateTitanPosition(titanName, coordinates) {
    this.titanPositions[titanName] = coordinates;
  }
}


//Determine Turn Order
function determineTurnOrder(players) {
  console.log("From deteremineTurnOrder playerUsernames:", players);
  for (let i = players.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [players[i], players[j]] = [players[j], players[i]];
  }
  console.log("From deteremineTurnOrder playerUsernames:", players);
  return players;
}

// Draw Cards
function determineStartingCards(players) {
  let chosenEquipmentCards = [];
  players.forEach((player) => {
    // Allocate 1 random equipment card
    do {
      const randomIndex = Math.floor(Math.random() * equipmentCards.length);
      equipmentCard = equipmentCards[randomIndex];
    } while (chosenEquipmentCards.includes(equipmentCard.equipmentName));
    player.inventory.equipment.push(equipmentCard);
    chosenEquipmentCards.push(equipmentCard.equipmentName);
  });

  return { chosenEquipmentCards };
}

// Set Titans to start
function determineStartingTitans(titanCards, numberOfPlayers) {
  // Initialize an empty array to hold the selected titan cards
  const selectedTitans = [];

  // Determine the number of titan cards to allocate based on the number of players
  const numberOfTitansToAllocate = determineNumberOfTitans(numberOfPlayers);

  // Allocate random titan cards
  for (let i = 0; i < numberOfTitansToAllocate; i++) {
    const randomIndex = Math.floor(Math.random() * titanCards.length);
    selectedTitans.push(titanCards[randomIndex]);
    titanCards.splice(randomIndex, 1);
  }

  return selectedTitans;
}

// Function to determine the number of titans based on the number of players
function determineNumberOfTitans(numberOfPlayers) {
  // Define the logic to determine the number of titans based on players
  // This is an example, adjust the logic based on your game rules
  if (numberOfPlayers <= 2) {
    return 2; // If 2 or fewer players, allocate 1 titan
  } else if (numberOfPlayers <= 3) {
    return 3; // If 3 or 4 players, allocate 2 titans
  } else {
    return 4; // If more than 4 players, allocate 3 titans
  }
}

// Function to place Titans on the grid
function placeTitansOnGrid(gridSize, titans) {
  const titanPositions = []; // Initialized as an empty array

  for (const titan of titans) {
    let positionFound = false;
    while (!positionFound) {
      let row = getRandomInt(3, gridSize - 4);
      let col = getRandomInt(3, gridSize - 4);

      if (isPositionValid(titanPositions, row, col)) {
        titanPositions.push({
          ...titan, // Spread the existing properties of the titan
          row, // Add the row property
          col, // Add the col property
        });
        positionFound = true;
      }
    }
  }

  return titanPositions;
}

// Helper function to get random integer within range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to check if the position is valid
function isPositionValid(titanPositions, row, col) {
  for (const pos of titanPositions) {
    if (Math.abs(pos.row - row) <= 6 && Math.abs(pos.col - col) <= 6) {
      return false; // Too close to another titan
    }
  }
  return true;
}

//DRAW PHASE
async function allocateResources(player, sessionId) {
  const sessionData = JSON.parse(await sessionClient.get(sessionId));

  let farmCount = 0;
  let ranchCount = 0;
  let plantationCount = 0;

  // Count each type of resource building for the single player
  player.buildings.forEach((building) => {
    if (building.category === "resource") {
      if (building.type === "farm") farmCount++;
      else if (building.type === "ranch") ranchCount++;
      else if (building.type === "plantation") plantationCount++;
    }
  });

  // Calculate the new resources to be added
  const newResources = 1 + farmCount * 1 + ranchCount * 2 + plantationCount * 3;

  // Retrieve the current resources from the player's inventory
  const currentResources = player.inventory.resources || 0; // Default to 0 if undefined

  // Add the new resources to the current total resources
  const totalResources = currentResources + newResources;

  // Update the player's resources in the inventory
  player.inventory.resources = totalResources;

  // Update the player in the session data and save the changes
  sessionData.gameState.player = player;
  await sessionClient.set(sessionId, JSON.stringify(sessionData));

  return newResources, totalResources; // Return the new total resources
}

async function drawPhaseCardDraw(player, sessionId) {
  const sessionData = JSON.parse(await sessionClient.get(sessionId));
  let card;
  do {
    const randomIndex = Math.floor(Math.random() * equipmentCards.length);
    card = equipmentCards[randomIndex];
  } while (
    sessionData.gameState.equipmentCardCount.includes(card.equipmentName)
  );

  player.inventory.equipment.push(card);
  sessionData.gameState.equipmentCardCount.push(card.equipmentName);
  await sessionClient.set(sessionId, JSON.stringify(sessionData));

  return card;
}

//Trade Phase
async function getTradeState(sessionId) {
  const tradeStateJson = await sessionClient.get(sessionId);
  // console.log("getTradeState: ", tradeStateJson);
  if (tradeStateJson) {
    return JSON.parse(tradeStateJson);
  } else {
    // Handle the case where there is no existing trade state
    // This could mean initializing a new trade state object or handling it as an error, depending on your application's logic
    return null; // or initialize a new state, e.g., {}
  }
}

async function addToTrade(sessionId, tradeState) {
  // console.log("addToTrade: ", JSON.stringify(tradeState));
  await sessionClient.set(sessionId, JSON.stringify(tradeState));
  return tradeState;
}

async function pendingTradeAcceptance(tradeSessionId, playerId) {
  // Retrieve the current trade session state
  let tradeStateJson = await sessionClient.get(tradeSessionId);
  let tradeSession = tradeStateJson ? JSON.parse(tradeStateJson) : {};
  // console.log("tradeSessionId", tradeSessionId);
  // console.log("tradeStateJson:", tradeStateJson);
  // Initialize acceptedPlayers if it doesn't exist
  tradeSession.acceptedPlayers = tradeSession.acceptedPlayers || {};

  // Update the acceptance status of the current player
  tradeSession.acceptedPlayers[playerId] = true;

  // Save the updated trade session
  await sessionClient.set(tradeSessionId, JSON.stringify(tradeSession));

  // Retrieve and log the updated trade session for debugging
  let updatedTradeStateJson = await sessionClient.get(tradeSessionId);
  let updatedTradeSession = JSON.parse(updatedTradeStateJson);

  // Check if both players have accepted the trade
  return Object.keys(updatedTradeSession.acceptedPlayers).length === 2;
}

const finalizeTrade = async (tradeSessionId, sessionId) => {
  const tradeStateJson = await sessionClient.get(tradeSessionId);
  const sessionData = JSON.parse(await sessionClient.get(sessionId));
  let tradeSession = tradeStateJson ? JSON.parse(tradeStateJson) : {};

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
      processTradeItems(
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
      await sessionClient.set(sessionId, JSON.stringify(sessionData));

      // Reset the trade session
      await sessionClient.set(tradeSessionId, JSON.stringify({}));

      return sessionData;
      // Commit transaction here if your database supports it
    } catch (error) {
      // Rollback transaction here if your database supports it
      console.error("Error processing trade:", error);
    }
  } else {
    console.error("Trade session not ready or missing", tradeSession);
  }
};

function processTradeItems(
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
    .concat(player1Inventory);
  // Update resources for both players
  player1Inventory.resources =
    player1Inventory.resources - player1Resources + player2Resources;
  player2Inventory.resources =
    player2Inventory.resources - player2Resources + player1Resources;
}

// Rest Phase 
async function restAccepted(sessionId, playerId){
  const sessionData = JSON.parse(await sessionClient.get(sessionId))
  const player = sessionData.players.find((p) => p.username === playerId);
  player.currentHealth = player.totalHealth
  
  return sessionData
}

// Function to handle player disconnection
async function handlePlayerDisconnect(sessionId, playerId) {
  const sessionData = JSON.parse(await sessionClient.get(sessionId));
  // Logic to pause game and replace player with NPC
  // Update session state accordingly
  await sessionClient.set(sessionId, JSON.stringify(sessionData));
}

// Function to handle player reconnection
async function handlePlayerReconnect(sessionId, playerId) {
  const sessionData = JSON.parse(await sessionClient.get(sessionId));
  // Logic to swap NPC back with the player
  // Update session state accordingly
  await sessionClient.set(sessionId, JSON.stringify(sessionData));
}

async function endGameSession(sessionId) {
  // Clean up the session data from Redis
  await sessionClient.del(sessionId);
  // Additional logic for saving the game result to MongoDB, if required
}

module.exports = {
  createGameSession,
  updateGameState,
  endGameSession,
  getGameState,
  drawPhaseCardDraw,
  allocateResources,
  getTradeState,
  addToTrade,
  pendingTradeAcceptance,
  finalizeTrade,
  restAccepted,
};
