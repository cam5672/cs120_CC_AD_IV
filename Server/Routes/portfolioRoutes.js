const express = require('express');
const { verifyToken } = require('../Middleware/authMiddleware'); // Import the middleware
const portfolioController = require('../Controllers/portfolioController');

module.exports = (pool) => {
    const router = express.Router();

    // Add stock to portfolio
    router.post('/', verifyToken, (req, res) => portfolioController.addStockToPortfolio(req, res));

    // Get portfolio for a specific user
    router.get('/', verifyToken, (req, res) => portfolioController.getUserPortfolio(req, res));

    // Delete stock from portfolio
    router.delete('/:stockSymbol', verifyToken, (req, res) => portfolioController.deleteStockFromPortfolio(req, res));

    return router;
};
