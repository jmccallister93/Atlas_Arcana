//GAME SESSION MANAGER

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
  // console.log(
  //   "createGameSession - playerOneId:",
  //   playerOneData,
  //   "playerTwoId:",
  //   playerTwoData
  // );
  const sessionId = uuidv4();
  // console.log("Before calling initializePlayers - player IDs:", [
  //   playerOneData.username,
  //   playerTwoData.username,
  // ]);
  // const players = [playerOneData.username, playerTwoData.username]

  // Initialize players with more detailed data
  const players = initializePlayers([playerOneData, playerTwoData]);
  // console.log("createGameSession - Players array:", players);

  // Determine random turn order
  const turnOrder = determineTurnOrder(players.map((p) => p.username));

  //Determine starting cards
  const startingCards = determineStartingCards(players);
  // const gameMap = createMap();
  // const turnOrder = determineTurnOrder(players.map((p) => p.id));

  const newSession = {
    sessionId,
    players,
    gameState: {
      turnOrder,
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
        battlement: 0
      },
      equipment: {
        armory: 0,
        forge: 1,
        attunementShrine:0,
        warehouse:0,
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
        humanCatapult:0,
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
      treasures: ["Whetstone", "Ember"],
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

// equipment cards
const equipmentCards = [
  {
    equipmentName: "Monster's Bane",
    rank: "1",
    slot: "weapon",
    set: "Slayer",
    element: "none",
    bonus: "monsters"
  },
  {
    equipmentName: "Duelist's Edge",
    rank: "1",
    slot: "weapon",
    set: "Duelist",
    element: "none",
    bonus: "players"
  },
  {
    equipmentName: "Doom Blade",
    rank: "1",
    slot: "weapon",
    set: "Conquerer",
    element: "none",
    bonus: "titans"
  },
  {
    equipmentName: "Guardian's Defender",
    rank: "1",
    slot: "weapon",
    set: "Guardian",
    element: "none",
    bonus: "defending"
  },
  {
    equipmentName: "Striker's Fury",
    rank: "1",
    slot: "weapon",
    set: "Berserker",
    element: "none",
    bonus: "attacking"
  },
];
// Draw Cards
function determineStartingCards(players) {
  console.log("from determineStartingCards: ");

  players.forEach((player) => {
    // Allocate 3 resources
    for (let i = 0; i < 1; i++) {
      player.inventory.resources.push(4);
    }

    // Allocate 1 random equipment card
    for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * equipmentCards.length);
    player.inventory.equipment.push(equipmentCards[randomIndex]);
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
