const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            requires: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            requires: true,
        },
        favoriteCount: {
            type: Number,
            default: 0,
        },
        favoritedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
