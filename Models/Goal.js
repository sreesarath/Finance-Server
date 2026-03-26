const mongoose = require('mongoose')

const goalSchema = new mongoose.Schema({
    userId: String,
    title: String,
    targetAmount: Number,

    savedAmount: {
        type: Number,
        default: 0   // ✅ IMPORTANT
    }
});

module.exports = mongoose.model('Goal', goalSchema)