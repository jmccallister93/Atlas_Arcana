const jwt = require("jsonwebtoken");
const User = require("../database/PlayerModel"); // Adjust path as needed
const bcrypt = require("bcryptjs");
const secret = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ user });
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

