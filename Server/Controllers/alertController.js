exports.getUserAlerts = async (req, res) => {
    const userId = req.userId; // Retrieved from authMiddleware
    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        const result = await pool.query('SELECT * FROM alerts WHERE user_id = $1', [userId]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching alerts:', err);
        res.status(500).json({ message: 'Server error fetching alerts' });
    }
};

exports.createAlert = async (req, res) => {
    const userId = req.userId;
    const { alertType, alertMessage } = req.body;

    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await pool.query(
            'INSERT INTO alerts (user_id, alert_type, alert_message, created_at) VALUES ($1, $2, $3, NOW())',
            [userId, alertType, alertMessage]
        );
        res.status(201).json({ message: 'Alert created successfully' });
    } catch (err) {
        console.error('Error creating alert:', err);
        res.status(500).json({ message: 'Server error creating alert' });
    }
};
