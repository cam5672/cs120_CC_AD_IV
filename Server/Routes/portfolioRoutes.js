const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  router.post('/', async (req, res) => {
    const { userId, stockSymbol, shares } = req.body;

    try {
      await pool.query(
        'INSERT INTO portfolios (user_id, stock_symbol, shares) VALUES ($1, $2, $3)',
        [userId, stockSymbol, shares]
      );
      res.status(201).json({ message: 'Stock added to portfolio' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
      const result = await pool.query('SELECT * FROM portfolios WHERE user_id = $1', [userId]);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
