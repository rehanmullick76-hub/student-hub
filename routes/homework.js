const express = require('express');
const router = express.Router();
const Homework = require('../models/Homework');

router.get('/', async (req, res) => {
    const items = await Homework.find().sort({ createdAt: -1 });
    res.json(items);
});

router.post('/', async (req, res) => {
    const item = new Homework(req.body);
    await item.save();
    res.status(201).json(item);
});

router.patch('/:id', async (req, res) => {
    await Homework.findByIdAndUpdate(req.params.id, { completed: req.body.completed });
    res.json({ message: 'Updated' });
});

router.delete('/:id', async (req, res) => {
    await Homework.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

module.exports = router;
