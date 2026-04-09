const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // 1. হেডার থেকে টোকেন নাও
    const token = req.header('x-auth-token');

    // 2. টোকেন না থাকলে এরর দাও
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // 3. টোকেন ভেরিফাই করো
    try {
        const decoded = jwt.verify(token, 'mySuperSecretJWTSecret');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
