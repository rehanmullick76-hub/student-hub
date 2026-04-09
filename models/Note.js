const mongoose = require('mongoose');
const NoteSchema = new mongoose.Schema({
    title: String,
    subject: String,
    description: String,
    uploadedBy: { type: String, default: 'Anonymous' },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Note', NoteSchema);
