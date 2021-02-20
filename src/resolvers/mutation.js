const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ForbiddenError, AuthenticationError } = require('apollo-server-express');
require('dotenv').config();

const gravatar = require('../util/gravatar');


module.exports = {
    newNote: async (parent, args, { models }) => {
        return await models.Note.create({
            content: args.content,
            author: 'test'
        });
    },

    deleteNote: async (parent, { id }, { models }) => {
        try {
            await models.Note.findOneAndRemove({ _id: id });
            return true;
        } catch (err) {
            console.error('error:', err);
            return false;
        }
    },
    updateNote: async (parent, { id, content }, { models }) => {
        return await models.Note.findOneAndUpdate({
            _id: id
        }, {
            $set: { content }
        }, {
            new: true
        });
    },
    singUp: async (parent, { username, email, password }, { models }) => {

        email = email.trim().toLowerCase();

        const hashed = await bcrypt.hash(password, 10);
        const avatar = gravatar(email);
        try {
            const user = models.User.create({
                username,
                email,
                avatar,
                password: hashed
            })
            return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        } catch (err) {
            console.err(err);
            throw new Error('singUp ERROR');
        }
    },
    singIn: async (parent, { username, password, email }, { models }) => {

        if (email) {
            email = email.trim().toLowerCase();
        }
        const user = await models.User.findOne({
            $or: [{ username }, { email }]
        })
        if (!user) {
            throw new AuthenticationError('user not found');
        }
        const vaild = await bcrypt.compare(password, user.password);
        if (!vaild) {
            throw new AuthenticationError('password mismatch');
        }
        return jwt.sign({ id: user._id }, process.env.JWT_SECRET);


    }

}