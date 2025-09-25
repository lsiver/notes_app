const jwt = require('jsonwebtoken');

module.exports = function requireAuth(req, res, next) {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({error: 'Missing token'});

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: payload.userId };
        next();
    } catch {
        return res.status(401).json( {error: 'Invalid or expired token'});
    }
};