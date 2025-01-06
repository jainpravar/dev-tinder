const mongoose = require("mongoose");

const connect_string = "mongodb+srv://devPravar:devPravar@nodejs.xgm3k.mongodb.net/DevTinder"

const connectDB = async()=>{
    console.log(connect_string);
    await mongoose.connect(connect_string)
}

module.exports = connectDB;