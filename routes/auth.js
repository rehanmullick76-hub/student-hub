const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const upload = require('../middleware/upload');

// @route   POST api/auth/register
router.post('/register', upload.single('avatar'), async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const avatar = req.file ? req.file.path : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4CAF50&color=fff&size=200`;

        user = new User({ name, email, password, avatar });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id } };

        jwt.sign(
            payload,
            'mySuperSecretJWTSecret',
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token, 
                    user: { 
                        id: user.id, 
                        name: user.name, 
                        email: user.email, 
                        avatar: user.avatar 
                    } 
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const payload = { user: { id: user.id } };

        jwt.sign(
            payload,
            'mySuperSecretJWTSecret',
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token, 
                    user: { 
                        id: user.id, 
                        name: user.name, 
                        email: user.email, 
                        avatar: user.avatar 
                    } 
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/upload-avatar
router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({ message: 'No token' });
        
        const decoded = jwt.verify(token, 'mySuperSecretJWTSecret');
        const user = await User.findById(decoded.user.id);
        
        if (req.file) {
            user.avatar = req.file.path;
            await user.save();
        }
        
        res.json({ avatar: user.avatar });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

// Simple register without image
router.post('/register-simple', async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });
        
        user = new User({ name, email, password });
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        
        const payload = { user: { id: user.id } };
        jwt.sign(payload, 'mySuperSecretJWTSecret', { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name, email } });
            });
    } catch (err) {
        res.status(500).send('Server error');
    }
});
