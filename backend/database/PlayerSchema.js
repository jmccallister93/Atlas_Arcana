//PLAYER SCHEMA

const mongoose = require("mongoose");
const bcrypt = require('bcryptjs'); // Make sure to install bcryptjs

const playerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: false
  },
  gameWins: {
    type: Number,
    require: false,
    unique: false,
  },
  gameLosses: {
    type: Number,
    require: false,
    unique: false,
  },
  friendsList: [{
    type: String,
    ref: 'Player'
  }],
  friendRequests: [{
    type: String,
    ref: 'Player'
  }],
  online: {
    type: Boolean,
    default: false
  }
});


module.exports = playerSchema;
