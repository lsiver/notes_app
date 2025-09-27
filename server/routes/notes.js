// routes/notes.js
const express = require('express');
const pool = require('../db.js')
const router = express.Router();

// GET /notes?user_id=X
router.get('/', async (req, res) => {
    //const { user_id } = req.query;
    const userId = req.user.id;
    try {
        const { rows } = await pool.query(
            //'SELECT * from notes WHERE user_id = $1 ORDER BY created_at DESC',
            //[user_id]
            `SELECT title, body, created_at FROM notes
            WHERE user_id = $1
            ORDER BY created_at DESC`,
            [userId]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({error:'Database error'});
    }
});

// POST /notes?
router.post('/', async (req, res) => {
    const {user_id, title, body} = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO notes (user_id, title, body)
            VALUES ($1, $2, $3) RETURNING *`,
            [user_id, title, body]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Database error'});
    }
});

module.exports = router;