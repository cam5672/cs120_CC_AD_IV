require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./Routes/userRoutes');
const portfolioRoutes = require('./Routes/portfolioRoutes');
const alertRoutes = require('./Routes/alertRoutes');
const { Pool } = require('pg');
const path = require('path');

const app = express();

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




// API Routes
app.use('/users', userRoutes(pool));
app.use('/portfolio', portfolioRoutes(pool));
app.use('/alerts', alertRoutes(pool));

// Routes for HTML pages
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../Public/html/home.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../Public/html/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../Public/html/register.html'));
});

app.get('/portfolio', (req, res) => {
  res.sendFile(path.join(__dirname, '../Public/html/portfolio.html'));
});

// Default Route to Handle Root Requests
app.get('/', (req, res) => {
  res.status(200).send('API is running');
});

// Logout Route
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return res.status(500).json({ error: 'Logout failed' });
      }
      res.status(200).send();
  });
});

// Catch-All Route for 404 Errors
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Server Setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
