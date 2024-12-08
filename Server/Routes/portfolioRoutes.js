const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  router.post('/', async (req, res) => {
    const { userId, stockSymbol, shares } = req.body;

    // validate input
    if (!userId || !stockSymbol || !shares || !purchasePrice || !purchaseDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      await pool.query(
        'INSERT INTO portfolios (user_id, stock_symbol, shares, purchase_price, purchase_date)\
         VALUES ($1, $2, $3, $4, $5)',
        [userId, stockSymbol, shares, purchasePrice, purchaseDate]
      );
      res.status(201).json({ message: 'Stock added to portfolio' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
      const result = await pool.query(
        'SELECT stock_symbol, shares, purchase_price, purchase_date\
        FROM portfolios WHERE user_id = $1',
        [userId]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
