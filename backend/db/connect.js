const mongoose = require('mongoose')

const connectDB = (url) => {
    mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("mongoDb connected succesfully")
})
}

module.exports = connectDB
