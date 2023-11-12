const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/atlasArcana')
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB...", err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log("We're connected to the database!");
});
