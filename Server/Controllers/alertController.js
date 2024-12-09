exports.getUserAlerts = async (req, res) => {
    const id = req.id; // Retrieved from authMiddleware
    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        const result = await pool.query('SELECT * FROM alerts WHERE id = $1', [id]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching alerts:', err);
        res.status(500).json({ message: 'Server error fetching alerts' });
    }
};

exports.createAlert = async (req, res) => {
    const { alertName, stocksIncluded, percentOrNominal, valuationPeriod, notificationMethod } = req.body;

    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await pool.query(
            `INSERT INTO alerts (alert_name, stocks_included, percent_or_nominal, valuation_period, notification_method)
             VALUES ($1, $2, $3, $4, $5)`,
            [id, alertName, stocksIncluded, percentOrNominal, valuationPeriod, notificationMethod]
          );
        res.status(201).json({ message: 'Alert created successfully' });
    } catch (err) {
        console.error('Error creating alert:', err);
        res.status(500).json({ message: 'Server error creating alert' });
    }
};
