// APP

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Player = require('../database/PlayerModel');
const authRoutes = require('../routes/authRoutes');
const authMiddleware = require('../authentication/authMiddleware')
const friendsRoutes = require('../routes/friendsRoute');


const app = express();
app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/atlasArcana')
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


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


// Auth routes
app.use('/auth', authRoutes);

// Protect game routes
app.use('/game', authMiddleware);

// Friends route
app.use('/friends', friendsRoutes);

app.get('/getUserId', authMiddleware, async (req, res) => {
  res.json({ userId: req.user._id });
});


module.exports = app;