//MATCH MAKING SERVICE

const redis = require("redis");
const client = redis.createClient(); // Default: localhost and port 6379
const gameSessionManager = require("./gameSessionManager");

client.on("error", (err) => console.log("Redis Client Error", err));
client.connect();

async function addToQueue(playerId) {
  await client.rPush("matchmakingQueue", playerId);
}

async function findMatch() {
  if ((await client.lLen("matchmakingQueue")) >= 2) {
    const playerOne = await client.lPop("matchmakingQueue");
    const playerTwo = await client.lPop("matchmakingQueue");

    const gameSession = await gameSessionManager.createGameSession(
      playerOne,
      playerTwo
    );
    notifyPlayers(playerOne, playerTwo, gameSession);
  }
}

function notifyPlayers(playerOne, playerTwo, gameSession) {
  // Implementation depends on how you manage real-time communication with players
  // For example, you could emit a WebSocket event here
}

setInterval(() => {
  findMatch().catch(console.error);
}, 5000); // Check for matches every 5 seconds
