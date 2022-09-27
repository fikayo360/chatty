const mongoose = require("mongoose")
const Schema = mongoose.Schema

const MessageSchema = Schema({
   conversationid:{type:String,required: true},
   text:{type:String,required: true},
   sender:{type:String,required: true}
},
{ timestamps: true }
)

const Message = mongoose.model("Message",MessageSchema)
module.exports = Message