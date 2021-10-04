const mongoose = require('mongoose');

module.exports = mongoose.model('Shortened', {
    created_at: Number,
    real_url: String
});