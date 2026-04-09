const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');

router.get('/', async (req, res) => {
    const plans = await Plan.find().sort({ createdAt: -1 });
    res.json(plans);
});

router.post('/', async (req, res) => {
    const plan = new Plan(req.body);
    await plan.save();
    res.status(201).json(plan);
});

router.delete('/:id', async (req, res) => {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

module.exports = router;
