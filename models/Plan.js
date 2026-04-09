const mongoose = require('mongoose');
const PlanSchema = new mongoose.Schema({
    event: String,
    date: String,
    time: String,
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Plan', PlanSchema);
