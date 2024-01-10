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
  const setCurrentPlayerTurn = (turnOrder) => {
    return turnOrder[0];
  };
  const currentPlayerTurn = setCurrentPlayerTurn(turnOrder);

  // Set starting phase of the game
  const currentPhase = "Setup";
  //Determine starting cards
  const startingCardData = determineStartingCards(players);

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
    health: 3,
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
  player.buildings.forEach(building => {
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

  return newResources,totalResources; // Return the new total resources
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
  console.log(tradeStateJson)
  if (tradeStateJson) {
      return JSON.parse(tradeStateJson);
  } else {
      // Handle the case where there is no existing trade state
      // This could mean initializing a new trade state object or handling it as an error, depending on your application's logic
      return null; // or initialize a new state, e.g., {}
  }
}
async function addToTrade(sessionId, tradeState) {
  await sessionClient.set(sessionId, JSON.stringify(tradeState));
  return tradeState;
}

// Wokring through here
async function pendingTradeAcceptance(sessionId, playerId) {
  const tradeStateJson = await sessionClient.get(sessionId);
  let tradeSession = tradeStateJson ? JSON.parse(tradeStateJson) : {};

  // Update acceptance status
  tradeSession.acceptedPlayers = tradeSession.acceptedPlayers || {};
  tradeSession.acceptedPlayers[playerId] = true;

  // Check if both players have accepted
  const allAccepted = Object.keys(tradeSession.acceptedPlayers).length === 2; // Assuming 2 players in trade

  await sessionClient.set(sessionId, JSON.stringify(tradeSession));
  return allAccepted;
}


const finalizeTrade = async (sessionId) => {
  const tradeStateJson = await sessionClient.get(sessionId);
  let tradeSession = tradeStateJson ? JSON.parse(tradeStateJson) : {};

  // Check if both players have accepted the trade
  if (tradeSession.acceptedPlayers && Object.keys(tradeSession.acceptedPlayers).length === 2) {
      // Get player IDs, excluding 'acceptedPlayers'
      const playerIds = Object.keys(tradeSession).filter(key => key !== 'acceptedPlayers');

      // Assuming there are always 2 players involved in the trade
      if (playerIds.length === 2) {
          const player1Id = playerIds[0];
          const player2Id = playerIds[1];

          const player1Trade = tradeSession[player1Id];
          const player2Trade = tradeSession[player2Id];

          // Fetch players' current game state
          const player1GameState = await getGameState(player1Id);
          const player2GameState = await getGameState(player2Id);

          // Process trade for Player 1
          // Remove traded items and add received items
          // Similar logic for Player 2

          // Update game state for both players
          await updateGameState(player1GameState);
          await updateGameState(player2GameState);

          // Notify players of trade completion
          // ...

          // Reset the trade session
          tradeSession = {}; 
          await sessionClient.set(sessionId, JSON.stringify(tradeSession));
      } else {
          console.error("Invalid number of players in trade session", tradeSession);
      }
  } else {
      console.error("Trade session not ready or missing", tradeSession);
  }
};



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
};
