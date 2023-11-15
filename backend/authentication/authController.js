const jwt = require("jsonwebtoken");
const User = require("../database/PlayerModel"); // Adjust path as needed
const bcrypt = require("bcryptjs");
const secret = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    // Generate a token
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });

    // Send back user data and token
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      console.log(`User not found with email: ${email}`);
      return res.status(401).send({ error: "Login failed. Email not found." });
    }

    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
      console.log("Incorrect password for user:", email);
      return res
        .status(401)
        .send({ error: "Login failed. Incorrect password." });
    }

    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });
    res.send({ user, token });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.sendFriendRequest = async (req, res) => {
  try {
    const { requesterId, recipientId } = req.body;
    const requester = await User.findById(requesterId);
    const recipient = await User.findById(recipientId);

    if (!recipient.friendRequests.includes(requesterId)) {
      recipient.friendRequests.push(requesterId);
      await recipient.save();

      res.status(200).send({ message: 'Friend request sent.' });
    } else {
      res.status(400).send({ message: 'Friend request already sent.' });
    }
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.respondToFriendRequest = async (req, res) => {
  try {
    const { recipientId, requesterId, accepted } = req.body;
    const recipient = await User.findById(recipientId);

    if (accepted) {
      recipient.friends.push(requesterId);
      const requester = await User.findById(requesterId);
      requester.friends.push(recipientId);
      await requester.save();
    }

    recipient.friendRequests = recipient.friendRequests.filter(id => id.toString() !== requesterId);
    await recipient.save();

    res.status(200).send({ message: 'Friend request response processed.' });
  } catch (error) {
    console.error("Error responding to friend request:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};
