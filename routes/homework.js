const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Homework = require('../models/Homework');

router.get('/', auth, async (req, res) => {
    try {
        const items = await Homework.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const newItem = new Homework({
            user: req.user.id,
            title: req.body.title,
            subject: req.body.subject,
            deadline: req.body.deadline
        });
        const item = await newItem.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.patch('/:id', auth, async (req, res) => {
    try {
        const item = await Homework.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        if (item.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });
        item.completed = req.body.completed;
        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await Homework.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        if (item.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });
        await Homework.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
