//MATCH MAKING SERVICE

const redis = require("redis");
const client = redis.createClient(); // Default: localhost and port 6379
const gameSessionManager = require("./gameSessionManager");

client.on("error", (err) => console.log("Redis Client Error", err));
client.connect();

async function addToQueue(playerData) {
  const playerDataString = JSON.stringify(playerData);
  console.log("Adding to queue:", playerData); // Log the original data
  console.log("Serialized data:", playerDataString); // Log the serialized data
  await client.rPush("matchmakingQueue", playerDataString);
}

// Find a match
async function findMatch(connectedUsers, io) {
  // Check if there are at least two players in the queue
  if ((await client.lLen("matchmakingQueue")) >= 2) {
    let playerOneDataString = await client.lPop("matchmakingQueue");
    let playerTwoDataString = await client.lPop("matchmakingQueue");

    let playerOneData;
    let playerTwoData;

    try {
      playerOneData = JSON.parse(playerOneDataString);
      playerTwoData = JSON.parse(playerTwoDataString);
      console.log("Player One Data:", playerOneData); // Log player one's data
      console.log("Player Two Data:", playerTwoData); // Log player two's data
    } catch (error) {
      console.error("Error parsing player data from matchmaking queue:", error);
      return;
    }

    // Check if playerOne and playerTwo are the same
    if (playerOneData.token === playerTwoData.token) {
      // If they are the same, put playerTwo back into the queue
      await client.rPush("matchmakingQueue", JSON.stringify(playerTwoData));

      // Try to find a different playerTwo
      if ((await client.lLen("matchmakingQueue")) >= 2) {
        let newPlayerTwoDataString = await client.lPop("matchmakingQueue");
        try {
          playerTwoData = JSON.parse(newPlayerTwoDataString);
        } catch (error) {
          console.error(
            "Error parsing new playerTwo data from matchmaking queue:",
            error
          );
          await client.rPush("matchmakingQueue", JSON.stringify(playerOneData));
          return;
        }
      } else {
        // If there's no other player, put playerOne back and return
        await client.rPush("matchmakingQueue", JSON.stringify(playerOneData));
        return;
      }
    }

    // If playerOne and playerTwo are different, proceed with match creation
    if (playerOneData.token !== playerTwoData.token) {
      const newSession = await gameSessionManager.createGameSession(
        playerOneData,
        playerTwoData
      );
      console.log(
        "From matchmakingservice new gamesession: ",
        JSON.stringify(newSession)
      ); // Log the entire session
      notifyPlayers(
        playerOneData,
        playerTwoData,
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
const notifyPlayers = (playerOneData, playerTwoData, newSession, sessionId, connectedUsers, io) => {
  // Extract the token from the player data
  const playerOneToken = playerOneData.token;
  const playerTwoToken = playerTwoData.token;

  // Get socket IDs using the tokens
  const playerOneSocketId = connectedUsers.get(playerOneData.token).socketId;
  const playerTwoSocketId = connectedUsers.get(playerTwoData.token).socketId;

  // Log the information with more specific details
  console.log("Player One (Token:", playerOneToken, ") Socket ID:", playerOneSocketId);
  console.log("Player Two (Token:", playerTwoToken, ") Socket ID:", playerTwoSocketId);

  if (playerOneSocketId && playerTwoSocketId) {
    const roomName = sessionId;
    io.sockets.sockets.get(playerOneSocketId)?.join(roomName);
    io.sockets.sockets.get(playerTwoSocketId)?.join(roomName);

    console.log("Players joined room:", roomName);
    
    // Emitting to the room
    io.to(roomName).emit("matchFound", newSession);
    console.log("Emitting 'matchFound' to room:", roomName);
  } else {
    console.log("One or both players are not connected");
  }
};


// Start the match making
function startMatchmaking(connectedUsers, io) {
  setInterval(() => {
    findMatch(connectedUsers, io).catch(console.error); // Pass connectedUsers here
  }, 5000); // Check for matches every 5 seconds
}

module.exports = { addToQueue, startMatchmaking, removeFromQueue };
