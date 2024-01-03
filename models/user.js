const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    password: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);