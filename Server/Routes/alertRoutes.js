const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // Get all alerts for a user
  router.get('/', async (req, res) => {
    const id = req.id; // Retrieved from authMiddleware
    try {
      const result = await pool.query(
        'SELECT * FROM alerts WHERE id = $1',
        [id]
      );
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      res.status(500).json({ error: 'Failed to fetch alerts' });
    }
  });

  // Create a new alert
  router.post('/', async (req, res) => {
    const { alertName, stocksIncluded, percentOrNominal, valuationPeriod, notificationMethod } = req.body;
    try {
      await pool.query(
        `INSERT INTO alerts (alert_name, stocks_included, percent_or_nominal, valuation_period, notification_method)
         VALUES ($1, $2, $3, $4, $5)`,
        [alertName, stocksIncluded, percentOrNominal, valuationPeriod, notificationMethod]
      );
      res.status(201).json({ message: 'Alert created successfully' });
    } catch (err) {
      console.error('Error creating alert:', err);
      res.status(500).json({ error: 'Failed to create alert' });
    }
  });

  // Delete an alert
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM alerts WHERE id = $1', [id]);
      res.status(200).json({ message: 'Alert deleted successfully' });
    } catch (err) {
      console.error('Error deleting alert:', err);
      res.status(500).json({ error: 'Failed to delete alert' });
    }
  });

  return router;
};
