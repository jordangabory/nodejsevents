const mongoose = require('mongoose');

var eventsSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'This field is required.'
    },
    createdAt: { type: Date, default: Date.now }
});


mongoose.model('Events', eventsSchema);