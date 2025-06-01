const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        default: '',
    },
     language: {
        type: String,
        default: 'javascript',
     },
     creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
     },
     users:[{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        role: {
            type: String,
            enum: ['admin', 'editor', 'viewer'],
            default: 'editor'
        },
     }],
     createdAt: {
        type: Date,
        default: Date.now,
     },
});


module.exports = mongoose.model('Room', roomSchema)