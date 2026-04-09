const mongoose = require('mongoose');
const HomeworkSchema = new mongoose.Schema({
    title: String,
    subject: String,
    deadline: String,
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Homework', HomeworkSchema);
