// Require the mongose library
const mongoose = require('mongoose');

module.exports = {
    connect: DB_HOST => {
        // Use the Mongo driver's updated URL string parser
        mongoose.set('useNewUrlParser', true);
        // Use `findOneAndUpdate()` in place of findAndModify()
        mongoose.set('useFindAndModify', false);
        // Use `createIndex()` in place of `ensureIndex()`
        mongoose.set('useCreateIndex', true);
        // Use the new server discovery & monitoring engine
        mongoose.set('useUnifiedTopology', true);
        // Connect to the DB
        mongoose.connect(
            'mongodb+srv://wilson:1234567aF@cluster0.ax1yv.mongodb.net/test?retryWrites=true&w=majority'
        );
        // Log an error if we fail to connect
        mongoose.connection.on('error', err => {
            console.error(err);
            console.log(
                'MongoDB connection error. Please make sure MongoDB is running.'
            );
            process.exit();
        });
    },

    close: () => {
        mongoose.connection.close();
    },
};
