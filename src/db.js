const mongoose = require('mongoose');

module.exports = {
    connect: DB_HOST =>{
        mongoose.set('useNewUrlParser',true);
        mongoose.set('useFindAndModify',true);
        mongoose.set('useCreateIndex',true);
        mongoose.set('useUnifiedTopology',true);
        mongoose.connect(DB_HOST);

        mongoose.connection.on('error',err=>{
            console.error(err);
            console.log('db connection errorr');
            process.exit();
        });
    },

    close: () =>{
        mongoose.connection.close();
    }

    
}
