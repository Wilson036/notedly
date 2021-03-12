module.exports = {
    notes: async (user, args, { models }) => {
        return await models.Note.find({ author: user.id }).sort({ _id: -1 });
    },
    favorites: async (user, args, { models }) => {
        return await models.Note.find({ favoritedBy: user.id }).sort({
            _id: -1,
        });
    },
};
