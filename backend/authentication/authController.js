const jwt = require('jsonwebtoken');
const User = require('../database/PlayerModel'); // Adjust path as needed
const bcrypt = require('bcryptjs');
const secret = process.env.JWT_SECRET;

console.log('JWT Secret:', secret);

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
    const { emailOrUsername, password } = req.body;
    const user = await User.findOne({ 
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) {
      console.log(`User not found with email/username: ${emailOrUsername}`);
      return res.status(401).send({ message: 'Login failed. User not found.' });
    }

    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
      console.log('Incorrect password for user:', emailOrUsername);
      return res.status(401).send({ message: 'Login failed. Incorrect password.' });
    }

    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
    res.send({ user, token });
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};