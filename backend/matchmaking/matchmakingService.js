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
async function findMatch(connectedUsers, io) {
  if ((await client.lLen("matchmakingQueue")) >= 2) {
    console.log("Attempting to find a match...");
    const playerOne = await client.lPop("matchmakingQueue");
    const playerTwo = await client.lPop("matchmakingQueue");
    console.log("Match found:", playerOne, playerTwo);

    const gameSession = await gameSessionManager.createGameSession(
      playerOne,
      playerTwo
    );
    console.log("~~~FROM FIND MATCH connected users: " + connectedUsers)
    notifyPlayers(playerOne, playerTwo, gameSession, connectedUsers, io);
  }
}

// Notify players
const notifyPlayers = (playerOneId, playerTwoId, gameSession, connectedUsers, io) => {
  const playerOneSocketId = connectedUsers.get(playerOneId);
  const playerTwoSocketId = connectedUsers.get(playerTwoId);
  // console.log("NOTIFY PLAYERS HAS FIRED WITH ID'S OF::: " + playerOneSocketId + playerTwoSocketId)
  if (playerOneSocketId && playerTwoSocketId) {
    // console.log("Match found for player 1 and player 2 with Id's of::: ", + playerOneSocketId, playerTwoSocketId)
    io.to(playerOneSocketId).emit("matchFound", gameSession);
    io.to(playerTwoSocketId).emit("matchFound", gameSession);
  }
};

// Start the match making
function startMatchmaking(connectedUsers,io) {
  setInterval(() => {
    findMatch(connectedUsers, io).catch(console.error); // Pass connectedUsers here
  }, 5000); // Check for matches every 5 seconds
}

module.exports = { addToQueue, startMatchmaking };
