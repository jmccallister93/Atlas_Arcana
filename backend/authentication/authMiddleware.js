const jwt = require('jsonwebtoken');
const User = require('../database/PlayerModel'); // Adjust path as needed

const secret = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, secret);
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      throw new Error("User not found.");
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};
