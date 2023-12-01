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
  const currentPhase = "Draw";
  //Determine starting cards
  const startingEquipmentCards = determineStartingCards(players);

  // GameBoard
  // Create tile grid to be sent to the front end
  const createTileGrid = () => {
    let gridSize = 18; // 18x18 grid
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
  const gridSize = 18;

  //Titans
  const titans = determineStartingTitans(titanCards, players.length);
  const titanPositions = placeTitansOnGrid(gridSize, titans);

  // NewSession to pass
  const newSession = {
    sessionId,
    players,
    gameState: {
      turnOrder,
      currentPlayerTurn,
      tileGrid, 
      currentPhase,
      turnsCompleted: 0,
      titans,
      titanPositions,
    },
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
    buildings: {
      defense: {
        outpost: 1,
        fortification: 0,
        archerTower: 0,
        battlement: 0,
      },
      equipment: {
        armory: 0,
        forge: 1,
        attunementShrine: 1,
        warehouse: 0,
      },
      quest: {
        tavern: 0,
        guildHall: 0,
        library: 0,
        oracleHut: 0,
      },
      resource: {
        farm: 0,
        ranch: 0,
        plantation: 0,
      },
      movement: {
        portal: 0,
        road: 0,
        humanCatapult: 0,
      },
    },
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
      resources: [],
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
  players.forEach((player) => {
    // Allocate 3 resources
    for (let i = 0; i < 1; i++) {
      player.inventory.resources.push(4);
    }

    // Allocate 1 random equipment card
    for (let i = 0; i < 1; i++) {
      const randomIndex = Math.floor(Math.random() * equipmentCards.length);
      player.inventory.equipment.push(equipmentCards[randomIndex]);
    }

    // // Allocate 1 random quest card
    // for (let i = 0; i < 1; i++) {
    //   const randomIndex = Math.floor(Math.random() * questCards.length);
    //   player.inventory.quests.push(questCards[randomIndex]);
    // }

    // // Allocate 1 random treasure card
    // for (let i = 0; i < 1; i++) {
    //   const randomIndex = Math.floor(Math.random() * treasureCards.length);
    //   player.inventory.treasures.push(treasureCards[randomIndex]);
    // }
  });

  return players;
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
        titanPositions.push({ titan, row, col });
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
};
