const mongoose = require('mongoose')

const connectDB = async ()=>{
    try {
        mongoose.connect(process.env.MONGODB_URI);
        console.log('mongoDB connected')

    }
    catch (error) {
        console.log('mongoDB connection error: ', error)
        process.exit(1);
    }
};

module.exports = connectDB