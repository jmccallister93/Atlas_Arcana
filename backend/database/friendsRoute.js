// freindsRoute.js backend
const authMiddleware = require("../authentication/authMiddleware");
const express = require("express");
const router = express.Router();
const Player = require("./PlayerModel"); // Adjust the path as necessary

// Send a friend request
router.post("/sendRequest", async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    console.log("fired before try in sendRequest");

    // Update sender's pending requests
    await Player.updateOne(
      { _id: senderId },
      { $addToSet: { pendingRequests: receiverId } }
    );

    // Update receiver's friend requests
    await Player.updateOne(
      { _id: receiverId },
      { $addToSet: { friendRequests: senderId } }
    );

    console.log("fired after try");
    res.status(200).json({ message: "Friend request sent to " + receiverId });
  } catch (error) {
    console.error("Error in sendRequest:", error);
    res.status(500).json({ error: error.message });
  }
});

// Accept a friend request
router.post("/acceptRequest", authMiddleware, async (req, res) => {
  const { userId, friendId } = req.body;
  console.log("RequestID: " + friendId);
  console.log("UserID: " + userId);
  try {
    // Add friendId to the userId's friendsList
    await Player.updateOne(
      { _id: userId },
      { $addToSet: { friendsList: friendId } }
    );

    // Add userId to the friendId's friendsList
    await Player.updateOne(
      { _id: friendId },
      { $addToSet: { friendsList: userId } }
    );

    // Remove friendId from the userId's friendRequests
    await Player.updateOne(
      { _id: userId },
      { $pull: { friendRequests: friendId } }
    );

    res.status(200).json({ message: "Friend request accepted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Decline a friend request
router.post("/rejectRequest", authMiddleware, async (req, res) => {
  const { requesterId } = req.body; // requesterId is the ObjectId of the friend who sent the request
  const userId = req.user._id; // Extracted from the token by authMiddleware
  console.log("RequestID: " + requesterId);
  console.log("UserID: " + userId);
  try {
    // Remove requesterId from userId's pendingRequests
    await Player.updateOne(
      { _id: userId },
      { $pull: { friendRequests: requesterId } }
    );

    res.status(200).json({ message: "Friend request declined." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a friend
router.post("/removeFriend", authMiddleware, async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user._id; // Extracting the user's ID from the token

  try {
    // Remove friendId from userId's friendsList
    await Player.updateOne({ _id: userId }, { $pull: { friendsList: friendId } });

    // Also remove userId from friendId's friendsList
    await Player.updateOne({ _id: friendId }, { $pull: { friendsList: userId } });

    res.status(200).json({ message: "Friend removed." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// search for friends
router.get("/search", authMiddleware, async (req, res) => {
  const { username } = req.query;
  const currentUser = req.user.username; // Extracted from the token by authMiddleware

  try {
    const users = await Player.find({
      username: { 
        $regex: username, 
        $options: "i",
        $ne: currentUser // Exclude current user
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get friends list
router.get("/friendsList", authMiddleware, async (req, res) => {
  // Assuming you have middleware to extract user ID from the token
  const userId = req.user._id;
  try {
    const user = await Player.findById(userId).populate('friendsList', 'username');
    res.status(200).json({ friendsList: user.friendsList  });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get friends requests
router.get("/friendRequests/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const user = await Player.findOne({ username: username }).populate(
      "friendRequests",
      "username"
    );
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user.friendRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
