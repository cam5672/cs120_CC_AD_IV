exports.getUserPortfolio = async (req, res) => {
    const userId = req.userId; // Retrieved from authMiddleware
    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        const result = await pool.query('SELECT * FROM portfolios WHERE user_id = $1', [userId]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching portfolio:', err);
        res.status(500).json({ message: 'Server error fetching portfolio' });
    }
};

exports.addStockToPortfolio = async (req, res) => {
    const userId = req.userId;
    const { stockSymbol, shares, purchasePrice, purchaseDate } = req.body;

    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await pool.query(
            'INSERT INTO portfolios (user_id, stock_symbol, shares, purchase_price, purchase_date, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
            [userId, stockSymbol, shares, purchasePrice, purchaseDate]
        );
        res.status(201).json({ message: 'Stock added to portfolio successfully' });
    } catch (err) {
        console.error('Error adding stock:', err);
        res.status(500).json({ message: 'Server error adding stock to portfolio' });
    }
};

exports.deleteStockFromPortfolio = async (req, res) => {
    const userId = req.userId;
    const { stockSymbol } = req.params;

    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await pool.query('DELETE FROM portfolios WHERE user_id = $1 AND stock_symbol = $2', [userId, stockSymbol]);
        res.status(200).json({ message: 'Stock removed from portfolio' });
    } catch (err) {
        console.error('Error deleting stock:', err);
        res.status(500).json({ message: 'Server error deleting stock' });
    }
};