//GAME SESSION MANAGER

const redis = require("redis");
const sessionClient = redis.createClient(); // You can use a separate client for session management
const { v4: uuidv4 } = require("uuid"); // For generating unique session IDs
const io = require("../server/server"); 

// Connect to Redis client
sessionClient.on("error", (err) =>
  console.log("Redis Session Client Error", err)
);
sessionClient.connect();

// Create a game session
async function createGameSession(playerOneId, playerTwoId) {
  console.log("Creating game session for players:", playerOneId, playerTwoId);
  const sessionId = uuidv4(); // Generate a unique session ID
  const players = initializePlayers([playerOneId, playerTwoId]);
  const gameMap = createMap();
  const turnOrder = determineTurnOrder(players.map((p) => p.id));

  const newSession = {
    sessionId,
    players,
    gameMap,
    turnOrder,
    gameState: {
      testState: false
    },
    isPaused: false, // Flag to indicate if game is paused
    // Other session-related data
  };

  await sessionClient.set(sessionId, JSON.stringify(newSession));
  return sessionId;
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

function initializePlayers(playerIds) {
  // Create player objects with initial stats, inventory, etc.
  return playerIds.map((id) => ({
    id,
    rank: 1,
    health: 3,
    offense: 0,
    defense: 0,
    stamina: 0,
    movement: 3,
    build: 1,
    inventory: {
      resources: [],
      equipment: [],
      treasures: [],
      quests: [],
    },
    // Other player-specific details
  }));
}

function createMap() {
  // Map creation logic
}

function determineTurnOrder(playerIds) {
  // Turn order determination logic
}
async function handleCombat(sessionId, combatDetails) {
  // Implement combat logic (PvP, PvE, Building Combat)
}
async function processWorldEvent(sessionId, event) {
  // Handle the effects of world events
}
async function checkVictoryCondition(sessionId) {
  // Check if any player has met the victory conditions
}

async function checkDefeatCondition(sessionId) {
  // Check if the lose condition (Titan Domination) is met
}
async function startNextTurn(sessionId) {
  // Logic to start the next turn (handle draw phase, reset stats, etc.)
}
async function handleTitanEvents(sessionId) {
  // Implement Titan movement and event handling
}
async function manageBuildings(sessionId, buildingAction) {
  // Handle building construction, upgrades, and destruction
}
async function handleTileInteraction(sessionId, tileDetails) {
  // Logic for handling different tile events
}
async function handleTreasureDiscovery(sessionId, player, treasureType) {
  // Logic for handling treasure discoveries
}

async function useTreasureCard(sessionId, player, treasureCard) {
  // Logic for using a treasure card
}
async function assignQuestCard(sessionId, player) {
  // Logic for assigning a quest card to a player
}

async function completeQuest(sessionId, player, questId) {
  // Logic for completing a quest and awarding VPs
}
async function movePlayer(sessionId, player, destination) {
  // Logic for moving a player on the map
}
async function drawResourceCard(sessionId, player) {
  // Logic for drawing a resource card
}

async function tradeResources(
  sessionId,
  playerFrom,
  playerTo,
  resourceDetails
) {
  // Logic for trading resources between players
}
async function drawEquipmentCard(sessionId, player) {
  // Logic for drawing an equipment card
}

async function upgradeEquipment(sessionId, player, equipmentId) {
  // Logic for upgrading equipment
}

async function manageInventory(sessionId, player, actionDetails) {
  // Logic for managing a player's inventory
}

async function notifyPlayerAction(sessionId, player, action) {
  // Notify players of a specific action taken by a player
}
async function rankUpPlayer(sessionId, player) {
  // Logic for handling player rank ups
}

async function updatePlayerStats(sessionId, player, statChanges) {
  // Logic for updating player stats
}
function validatePlayerAction(sessionId, player, action) {
  // Validate a player action and return an error if invalid
}

function handleGameError(sessionId, error) {
  // Logic for handling game errors
}

async function endGameSession(sessionId) {
  // Clean up the session data from Redis
  await sessionClient.del(sessionId);
  // Additional logic for saving the game result to MongoDB, if required
}



async function notifyPlayers(playerOne, playerTwo, sessionId) {
  // Emit an event to both players with the session ID
  io.to(playerOne.socketId).emit("gameSessionCreated", { sessionId });
  io.to(playerTwo.socketId).emit("gameSessionCreated", { sessionId });
}

module.exports = { createGameSession, updateGameState, endGameSession, getGameState };
