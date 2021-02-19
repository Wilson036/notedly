
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
    }
}