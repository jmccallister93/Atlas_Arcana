//MATCH MAKING SERVICE

const redis = require("redis");
const client = redis.createClient(); // Default: localhost and port 6379
const gameSessionManager = require("./gameSessionManager");

client.on("error", (err) => console.log("Redis Client Error", err));
client.connect();

// Add player to game que
async function addToQueue(playerId) {
  await client.rPush("matchmakingQueue", playerId);
}

// Find a match
async function findMatch(connectedUsers, io) {
  if ((await client.lLen("matchmakingQueue")) >= 2) {
    const playerOne = await client.lPop("matchmakingQueue");
    let playerTwo = await client.lPop("matchmakingQueue");

    // Check if playerOne and playerTwo are the same
    if (playerOne === playerTwo) {
      // If they are the same, put playerTwo back into the queue
      await client.rPush("matchmakingQueue", playerTwo);

      // Try to find a different playerTwo
      if ((await client.lLen("matchmakingQueue")) >= 2) {
        playerTwo = await client.lPop("matchmakingQueue");
      } else {
        // If there's no other player, put playerOne back and return
        await client.rPush("matchmakingQueue", playerOne);
        return;
      }
    }

    // If playerOne and playerTwo are different, proceed with match creation
    if (playerOne !== playerTwo) {
      const newSession = await gameSessionManager.createGameSession(
        playerOne,
        playerTwo
      );
      console.log(
        "From matchmakingservice new gamesession: ",
        JSON.stringify(newSession)
      ); // Log the entire session
      notifyPlayers(
        playerOne,
        playerTwo,
        newSession,
        newSession.sessionId,
        connectedUsers,
        io
      );
    }
  }
}

// Remove player from queue
async function removeFromQueue(playerId) {
  console.log("Removing player from queue:", playerId);

  // Retrieve the entire matchmaking queue
  const queue = await client.lRange("matchmakingQueue", 0, -1);

  // Find the index of the player in the queue
  const index = queue.indexOf(playerId);

  // If the player is in the queue, remove them
  if (index !== -1) {
    await client.lRem("matchmakingQueue", 1, playerId);
  }
}

// Notify players
const notifyPlayers = (
  playerOneId,
  playerTwoId,
  newSession,
  sessionId,
  connectedUsers,
  io
) => {
  const playerOneSocketId = connectedUsers.get(playerOneId);
  const playerTwoSocketId = connectedUsers.get(playerTwoId);
  if (playerOneSocketId && playerTwoSocketId) {
    const roomName = sessionId;
    // Join both players to the room
    io.sockets.sockets.get(playerOneSocketId)?.join(roomName);
    io.sockets.sockets.get(playerTwoSocketId)?.join(roomName);
    // Notify players in the room
    io.to(roomName).emit("matchFound",  newSession );
  }
  console.log(
    "From matchmaking service notifying players gameSession: " +
      JSON.stringify(newSession)
  );
};

// Start the match making
function startMatchmaking(connectedUsers, io) {
  setInterval(() => {
    findMatch(connectedUsers, io).catch(console.error); // Pass connectedUsers here
  }, 5000); // Check for matches every 5 seconds
}

module.exports = { addToQueue, startMatchmaking, removeFromQueue };
