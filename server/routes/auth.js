const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db.js');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

//POST /auth/signup
router.post('/signup', async (req, res) => {
    const {email, password, username} = req.body;
    try {
        const hash = await bcrypt.hash(password, 12);
        const { rows } = await pool.query(
            `INSERT INTO users (email, password_hash, username)
            VALUES ($1, $2, $3) RETURNING id, email, username, created_at`,
            [email, hash, username || null] 
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        if (err.code === '23505') return res.status(409).json({error: 'Email already exists'});
        console.error(err);
        res.status(500).json({error:'Server error'});
    }
});

// POST /auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { rows } = await pool.query(
            `SELECT id, email, username, password_hash FROM users WHERE email = $1`,
            [email]
        );
        const user = rows[0];
        if (!user) return res.status(401).json({error:'invalid credentials'});

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) return res.status(401).json({ error: 'Invalid credentials'});

        const token = jwt.sign( {userId: user.id}, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.json( { token, user: { id: user.id, email: user.email, username: user.username }});
    } catch (err) {
        console.error(err);
        res.status(500).json ({ error: 'Server error'});
    }
});

module.exports = router;