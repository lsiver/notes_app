// routes/users/js
const express = require('express');
const pool = require('../db.js')
const router = express.Router();

// GET/users
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users ORDER BY id');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({error:'Database error'});
    }
});

//POST /users (when mounted...)
router.post('/', async (req, res) => {
    const {email, password_hash } = req.body;
    try {
        const {rows} = await pool.query(
            `INSERT INTO users (email, password_hash)
            VALUES ($1, $2) RETURNING *`,
            [email, password_hash]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Database error'});
    }
});

module.exports = router;