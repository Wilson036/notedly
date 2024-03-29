const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    ForbiddenError,
    AuthenticationError,
} = require('apollo-server-express');
require('dotenv').config();

const gravatar = require('../util/gravatar');

const mongoose = require('mongoose');

module.exports = {
    newNote: async (parent, args, { models, user }) => {
        if (!user) {
            throw new AuthenticationError('you should sign in to create notes');
        }
        return await models.Note.create({
            content: args.content,
            author: mongoose.Types.ObjectId(user.id),
        });
    },

    deleteNote: async (parent, { id }, { models, user }) => {
        try {
            if (!user) {
                throw new AuthenticationError(
                    'you should sign in to create notes'
                );
            }
            const note = await models.Note.findById({ _id: id });

            if (note && String(note.author) !== user.id) {
                throw new ForbiddenError('not have permission to delete Note');
            }
            await note.remove();
            return true;
        } catch (err) {
            console.error('error:', err);
            return false;
        }
    },
    updateNote: async (parent, { id, content }, { models, user }) => {
        if (!user) {
            throw new AuthenticationError('you should sign in to create notes');
        }
        const note = await models.Note.findById({ _id: id });

        if (note && String(note.author) !== user.id) {
            throw new ForbiddenError('not have permission to update Note');
        }
        return await models.Note.findOneAndUpdate(
            {
                _id: id,
            },
            {
                $set: { content },
            },
            {
                new: true,
            }
        );
    },
    signUp: async (parent, { username, email, password }, { models }) => {
        email = email.trim().toLowerCase();

        const hashed = await bcrypt.hash(password, 10);
        const avatar = gravatar(email);
        try {
            const user = models.User.create({
                username,
                email,
                avatar,
                password: hashed,
            });
            return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        } catch (err) {
            console.err(err);
            throw new Error('singUp ERROR');
        }
    },
    signIn: async (parent, { username, password, email }, { models }) => {
        if (email) {
            email = email.trim().toLowerCase();
        }
        const user = await models.User.findOne({
            $or: [{ username }, { email }],
        });
        if (!user) {
            throw new AuthenticationError('user not found');
        }
        const vaild = await bcrypt.compare(password, user.password);
        if (!vaild) {
            throw new AuthenticationError('password mismatch');
        }
        return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    },
    toggleFavorite: async (parent, { id }, { models, user }) => {
        if (!user) {
            throw new AuthenticationError('user not found');
        }
        let checkNote = await models.Note.findById(id);
        const hasUser = checkNote.favoritedBy.indexOf(user.id);

        if (hasUser >= 0) {
            return await models.Note.findOneAndUpdate(
                id,
                {
                    $pull: {
                        favoritedBy: mongoose.Types.ObjectId(user.id),
                    },
                    $inc: {
                        favoriteCount: -1,
                    },
                },
                { new: true }
            );
        } else {
            return await models.Note.findOneAndUpdate(
                id,
                {
                    $push: {
                        favoritedBy: mongoose.Types.ObjectId(user.id),
                    },
                    $inc: {
                        favoriteCount: 1,
                    },
                },
                { new: true }
            );
        }
    },
};
