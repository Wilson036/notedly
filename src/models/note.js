const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            requires: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            requires: true,
        },
    },
    {
        timestamps: true,
    }
);

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
