//MATCH MAKING SERVICE

const redis = require("redis");
const client = redis.createClient(); // Default: localhost and port 6379
const gameSessionManager = require("./gameSessionManager");

client.on("error", (err) => console.log("Redis Client Error", err));
client.connect();

// Add player to game que
async function addToQueue(playerId) {
  console.log("Adding player to queue:", playerId);
  await client.rPush("matchmakingQueue", playerId);
}

// Find a match 
async function findMatch() {
  if ((await client.lLen("matchmakingQueue")) >= 2) {
    console.log("Attempting to find a match...");
    const playerOne = await client.lPop("matchmakingQueue");
    const playerTwo = await client.lPop("matchmakingQueue");
    console.log("Match found:", playerOne, playerTwo);

    const gameSession = await gameSessionManager.createGameSession(
      playerOne,
      playerTwo
    );
    notifyPlayers(playerOne, playerTwo, gameSession);
  }
}

// Notify players
function notifyPlayers(playerOne, playerTwo, gameSession) {
  // Implementation depends on how you manage real-time communication with players
  // For example, you could emit a WebSocket event here
}

// Start the match making
function startMatchmaking() {
  setInterval(() => {
    findMatch().catch(console.error);
  }, 5000); // Check for matches every 5 seconds
}

module.exports = { addToQueue, startMatchmaking };