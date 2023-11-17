//AUTH ROUTE sends the routes to the app.js

const express = require('express');
const authController = require('../authentication/authController');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
