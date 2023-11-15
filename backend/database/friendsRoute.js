// freindsRoute.js backend
const authMiddleware = require('../authentication/authMiddleware');
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
    const { username, friendUsername } = req.body;
    try {
      const user = await Player.findOne({ username: username });
      const friend = await Player.findOne({ username: friendUsername });
  
      if (!user || !friend) {
        return res.status(404).json({ message: "User not found" });
      }
  
      await Player.updateOne(
        { _id: user._id },
        { $pull: { pendingRequests: friend._id }, $addToSet: { friendsList: friend._id } }
      );
  
      res.status(200).json({ message: "Friend request accepted." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Decline a friend request
  router.post("/rejectRequest", authMiddleware, async (req, res) => {
    const { username, requesterUsername } = req.body;
    try {
      const user = await Player.findOne({ username: username });
      const requester = await Player.findOne({ username: requesterUsername });
  
      if (!user || !requester) {
        return res.status(404).json({ message: "User not found" });
      }
  
      await Player.updateOne(
        { _id: user._id },
        { $pull: { pendingRequests: requester._id } }
      );
  
      res.status(200).json({ message: "Friend request declined." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Reject/Remove a friend
router.post("/removeFriend", async (req, res) => {
  const { userId, friendId } = req.body;
  try {
    // Remove friendId from friendsList
    await Player.updateOne(
      { _id: userId },
      { $pull: { friendsList: friendId } }
    );
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
        username: { $regex: username, $options: 'i' },
        username: { $ne: currentUser } // Exclude current user
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Get friends list
router.get("/list", async (req, res) => {
  // Assuming you have middleware to extract user ID from the token
  const userId = req.user._id;
  try {
    const user = await Player.findById(userId);
    // Assuming the friends are stored in a 'friends' field in your user model
    res.status(200).json({ friends: user.friends });
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
