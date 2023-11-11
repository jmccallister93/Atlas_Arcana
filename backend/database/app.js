const express = require('express');
const mongoose = require('mongoose');
const Player = require('./PlayerModel');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1/atlasArcana', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Create new player
app.post('/players', async (req, res) => {
    try {
      const newPlayer = new Player(req.body);
      await newPlayer.save();
      res.status(201).send(newPlayer);
    } catch (error) {
      res.status(400).send(error);
    }
});

// GET all Players
app.get('/players', async (req, res) => {
    try {
      const players = await Player.find();
      res.status(200).send(players);
    } catch (error) {
      res.status(500).send(error);
    }
});

// Update a specific player
app.put('/players/:id', async (req, res) => {
    try {
        const updatedPlayer = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPlayer) {
            return res.status(404).send();
        }
        res.status(200).send(updatedPlayer);
    } catch (error) {
        res.status(400).send(error);
    }
});


// Delete a specific player
app.delete('/players/:id', async (req, res) => {
    try {
        const player = await Player.findByIdAndDelete(req.params.id);
        if (!player) {
            return res.status(404).send();
        }
        res.status(200).send(player);
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = app;