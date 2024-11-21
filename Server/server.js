require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./Routes/userRoutes');
const portfolioRoutes = require('./Routes/portfolioRoutes');
const alertRoutes = require('./Routes/alertRoutes');
const { Pool } = require('pg');

const app = express();

// Database Pool Configuration
const pool = new Pool({
  connectionString: 'postgresql://MarketStack%20Stock%20Data_owner:9jKSsIn2WDwF@ep-autumn-surf-a6mzhktt-pooler.us-west-2.aws.neon.tech/MarketStack%20Stock%20Data?sslmode=require',
  ssl: { rejectUnauthorized: false },
});

// Test Database Connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Database connected successfully. Current time:', res.rows[0].now);
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/users', userRoutes(pool));
app.use('/portfolio', portfolioRoutes(pool));
app.use('/alerts', alertRoutes(pool));

// Server Setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
