module.exports = {
    notes: async (parent, args, { models }) => {
        return await models.Note.find().limit(100);
    },
    note: async (parent, args, { models }) => {
        return await models.Note.findById(args.id);
    },

    users: async (parent, args, { models }) => {
        return await models.User.find({});
    },
    user: async (parent, { username }, { models }) => {
        return await models.User.findOne({ username });
    },
    me: async (parent, args, { models, user }) => {
        return await models.User.findById(user.id);
    },
    noteFeed: async (parent, { cursor }, { models }) => {
        const limit = 10;

        let hasNextPage = false;

        let cursorQuery = {};

        //查詢objectId小於cursor的資料
        if (cursor) {
            cursorQuery = { _id: { $lt: cursor } };
        }

        let notes = await models.Note.find(cursorQuery)
            .sort({ _id: -1 })
            .limit(limit + 1);
        if (notes.length > limit) {
            hasNextPage = true;
            //從第一個複製到倒數第二個
            notes = notes.slice(0, -1);
        }

        //下一個指標將會是陣列最後一個資料的objectId
        const newCursor = notes[notes.length - 1]._id;

        return { notes, cursor: newCursor, hasNextPage };
    },
};
