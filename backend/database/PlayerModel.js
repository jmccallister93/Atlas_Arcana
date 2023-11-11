const playerSchema = require('./PlayerSchema');
const mongoose = require('mongoose');

// Use the schema to create a model.
const Player = mongoose.model('Player', playerSchema);

module.exports = Player;