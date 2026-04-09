const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use('/api/notes', require('./routes/notes'));
app.use('/api/homework', require('./routes/homework'));
app.use('/api/plans', require('./routes/plans'));

app.listen(PORT, () => console.log('Server running on port ' + PORT));
