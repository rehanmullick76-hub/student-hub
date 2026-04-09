const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Plan = require('../models/Plan');

router.get('/', auth, async (req, res) => {
    try {
        const plans = await Plan.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(plans);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const newPlan = new Plan({
            user: req.user.id,
            event: req.body.event,
            date: req.body.date,
            time: req.body.time
        });
        const plan = await newPlan.save();
        res.status(201).json(plan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);
        if (!plan) return res.status(404).json({ message: 'Not found' });
        if (plan.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });
        await Plan.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
