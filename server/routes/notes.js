// routes/notes.js
const express = require('express');
const pool = require('../db.js')
const router = express.Router();

// GET /notes
router.get('/', async (req, res) => {
    const userId = req.user.id;
    try {
        const { rows } = await pool.query(
            `SELECT id, title, body, created_at FROM notes
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
    const userId = req.user.id
    const {title, body} = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO notes (user_id, title, body)
            VALUES ($1, $2, $3) RETURNING *`,
            [userId, title, body]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Database error'});
    }
});

// DELETE /notes/:id
router.delete('/:id', async (req, res) => {
    const userId = req.user.id;
    const noteId = Number(req.params.id);

    if (!Number.isInteger(noteId)) {
        return res.status(400).json({error:'Invalid note id'})
    }

    const {rows} = await pool.query(
        'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id',
        [noteId, userId]
    )

    if (rows.length === 0) return res.status(404).json({error:'Not found'});
    return res.status(204).end();
});

module.exports = router;