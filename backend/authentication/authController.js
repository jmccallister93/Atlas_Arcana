const jwt = require('jsonwebtoken');
const User = require('../database/PlayerModel'); // Adjust path as needed

// Use the JWT secret from the environment variable
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
      const user = await User.findByCredentials(req.body.email, req.body.password);
      const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
      res.send({ user, token });
    } catch (error) {
      res.status(401).send({ message: 'Login failed. Check authentication credentials.' });
    }
  };
  