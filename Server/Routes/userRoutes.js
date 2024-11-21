const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (pool) => {
  const router = express.Router();

  router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
        [username, email, hashedPassword]
      );
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (!result.rows.length) return res.status(404).json({ error: 'User not found' });

      const user = result.rows[0];
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
