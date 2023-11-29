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

  //Determine starting cards
  const startingCards = determineStartingCards(players);

  // GameBoard
  // Create random seed to be passed
  const gameBoardSeed = Math.floor(Math.random() * 10000);
  // In your createGameSession function or similar place
  function createRandomSequence(length) {
    const sequence = [];
    for (let i = 0; i < length; i++) {
      sequence.push(Math.random()); // Generates a number between 0 and 1
    }
    return sequence;
  }

  // When creating a new game session
  const randomSequence = createRandomSequence(576);

  // Create tile grid to be sent to the front end
  
  const createTileGrid = () => {
    let gridSize = 576;
    const tileGrid = [];
    // Define tile types and their cumulative distribution probabilities
    const tileTypes = [
      { type: "oasis", probability: 0.05 },
      { type: "desert", probability: 0.25 }, // 0.05 + 0.20
      { type: "forest", probability: 0.50 }, // 0.25 + 0.25
      { type: "grassland", probability: 0.75 }, // 0.50 + 0.25
      { type: "tundra", probability: 1.00 } // 0.75 + 0.25
    ];
  
    for (let i = 0; i < gridSize; i++) {
      // Generate a random number between 0 and 1
      let randomNum = Math.random();
      // Determine the tile type based on the random number
      let tileType = tileTypes.find(tile => randomNum <= tile.probability).type;
      // Add the determined tile type to the grid
      tileGrid.push(tileType);
    }
  
    return tileGrid;
  };
  
  const tileGrid = createTileGrid();
  


  // NewSession to pass
  const newSession = {
    sessionId,
    players,
    gameState: {
      turnOrder,
      // gameBoardSeed,
      // randomSequence,
      tileGrid,
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

    // Allocate 1 random equipment card
    for (let i = 0; i < 1; i++) {
      const randomIndex = Math.floor(Math.random() * questCards.length);
      player.inventory.quests.push(questCards[randomIndex]);
    }

    // Allocate 1 random equipment card
    for (let i = 0; i < 1; i++) {
      const randomIndex = Math.floor(Math.random() * treasureCards.length);
      player.inventory.treasures.push(treasureCards[randomIndex]);
    }
  });

  return players;
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
