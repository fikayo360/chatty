const mongoose = require("mongoose")
const Schema = mongoose.Schema

const NotificationSchema = Schema({
    userid:{type:String,required:true},
    message:{type:String,required:true},
    individualpic:{type:String},
    receiverid:{type:String},
},
{ timestamps: true }
)

const Notification  = mongoose.model("Notification",NotificationSchema)
module.exports = Notification