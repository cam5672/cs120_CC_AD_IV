const express = require('express');
const { registerUser, loginUser } = require('../Controllers/userController');

module.exports = (pool) => {
    const router = express.Router();

    // Register Route
    router.post('/register', (req, res) => registerUser(req, res, pool));

    // Login Route
    router.post('/login', (req, res) => loginUser(req, res, pool));

    return router;
};
