//PLAYER MODEL

const playerSchema = require('./PlayerSchema');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Static method to find user by email and password
playerSchema.statics.findByCredentials = async function(email, password) {
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error('Unable to login');
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Unable to login');
    }
  
    return user;
  };
  
  // Hash the plain text password before saving
  playerSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
  });

// Add friend requests and friends arrays to the schema
playerSchema.add({
  friendRequests: [{ type: String, ref: 'Player' }],
  friends: [{ type:String, ref: 'Player' }]
});

// Use the schema to create a model.
const Player = mongoose.model('Player', playerSchema);

module.exports = Player;