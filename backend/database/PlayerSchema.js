const mongoose = require("mongoose");

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
  gameWins: {
    type: Int32Array,
    require: false,
    unique: false,
  },
  gameLosses: {
    type: Int32Array,
    require: false,
    unique: false,
  },
  friendsList:{
    type: String,
    require: false,
    unique: false,
  }
});

module.exports = playerSchema;
