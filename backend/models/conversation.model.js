const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ConversationSchema = Schema({
    userid:{type:String,required:true},
    members: {type:Array,required: true}
},
{ timestamps: true }
)

const Conversation = mongoose.model("Conversation",ConversationSchema)
module.exports = Conversation