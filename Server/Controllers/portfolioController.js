exports.getUserPortfolio = async (req, res) => {
    const id = req.id; // Retrieved from authMiddleware
    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        const result = await pool.query('SELECT * FROM portfolios WHERE id = $1', [id]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching portfolio:', err);
        res.status(500).json({ message: 'Server error fetching portfolio' });
    }
};

exports.addStockToPortfolio = async (req, res) => {
    
    const {stockSymbol, shares, purchasePrice, purchaseDate } = req.body;

    if (!stockSymbol || !shares || !purchasePrice || !purchaseDate) {
        return res.status(400).json({ error: "All fields are required." });
      }

    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await pool.query(
            'INSERT INTO portfolios (stock_symbol, shares, purchase_price, purchase_date) VALUES ($1, $2, $3, $4)',
            [stockSymbol, shares, purchasePrice, purchaseDate]
        );
        res.status(201).json({ message: 'Stock added to portfolio successfully' });
    } catch (err) {
        console.error('Error adding stock:', err);
        res.status(500).json({ message: 'Server error adding stock to portfolio' });
    }
};

exports.deleteStockFromPortfolio = async (req, res) => {
  
    const { id,stockSymbol } = req.params;

    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await pool.query('DELETE FROM portfolios WHERE id = $1 AND stock_symbol = $2', [id, stockSymbol]);
        res.status(200).json({ message: 'Stock removed from portfolio' });
    } catch (err) {
        console.error('Error deleting stock:', err);
        res.status(500).json({ message: 'Server error deleting stock' });
    }
};
