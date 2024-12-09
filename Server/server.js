require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const userRoutes = require('./Routes/userRoutes');
const portfolioRoutes = require('./Routes/portfolioRoutes');
const alertRoutes = require('./Routes/alertRoutes');

const app = express();

// Validate Environment Variables
if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
    console.error('Missing required environment variables');
    process.exit(1);
}

// Database Pool Configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../Public')));

// API Routes with `/api` Prefix
app.use('/users', userRoutes(pool));
app.use('/api/portfolio', portfolioRoutes(pool));
app.use('/api/notifications', alertRoutes(pool));

// Routes for HTML Pages
app.get('/home', (req, res) => res.sendFile(path.join(__dirname, '../Public/html/home.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../Public/html/login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, '../Public/html/register.html')));
app.get('/portfolio', (req, res) => res.sendFile(path.join(__dirname, '../Public/html/portfolio.html')));
app.get('/market', (req, res) => res.sendFile(path.join(__dirname, '../Public/html/market.html')));
app.get('/news', (req, res) => res.sendFile(path.join(__dirname, '../Public/html/news.html')));
app.get('/notifications', (req, res) => res.sendFile(path.join(__dirname, '../Public/html/notifications.html')));

// Default Route for API Status
app.get('/', (req, res) => res.status(200).send('API is running'));

// Logout Route
app.post('/logout', (req, res) => {
    // If using session middleware, ensure it's configured
    res.status(200).send({ message: 'Logged out' });
});

// Catch-All Route for 404 Errors
app.use((req, res) => res.status(404).send('Page not found'));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
