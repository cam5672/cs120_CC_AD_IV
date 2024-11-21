const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  router.post('/', async (req, res) => {
    const { userId, stockSymbol, priceThreshold, timeFrame } = req.body;

    try {
      await pool.query(
        'INSERT INTO alerts (user_id, stock_symbol, price_threshold, time_frame) VALUES ($1, $2, $3, $4)',
        [userId, stockSymbol, priceThreshold, timeFrame]
      );
      res.status(201).json({ message: 'Alert created' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
