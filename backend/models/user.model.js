const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = Schema({
 username:{type:String,required: true},
 email:{type:String,required: true},
 password:{type:String,required: true},
 profilepic:{type:String},
 backgroundpic:{type:String},
 friends:{type:Array},
 city:{type:String},
 sex:{type:String},
 relationship:{type:String}
},
{ timestamps: true }
)

const User = mongoose.model("User",UserSchema)
module.exports = User