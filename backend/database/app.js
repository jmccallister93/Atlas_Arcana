require('dotenv').config();
console.log('JWT Secret from app.js:', process.env.JWT_SECRET);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Player = require('./PlayerModel');
const authRoutes = require('../authentication/authRoutes');
const authMiddleware = require('../authentication/authMiddleware')
const { validatePlayerData } = require('../validation/validatePlayerData');


const app = express();
app.use(cors({
  origin: "http://localhost:5173"
}));
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
  console.log(req.body)
  if (!validatePlayerData(req.body)) {
    return res.status(400).send({ error: 'Invalid player data' });
  }
    try {
      const newPlayer = new Player(req.body);
      await newPlayer.save();
      res.status(201).send(newPlayer);
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(400).send({ error: error.message });
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


app.use('/auth', authRoutes);

// Protect game routes
app.use('/game', authMiddleware);


module.exports = app;