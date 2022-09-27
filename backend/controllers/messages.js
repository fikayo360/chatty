const Message = require("../models/message.model")

const addmessage = async(req,res)=>{
    const {conversationid,text,sender} = req.body
    const newmessage = new Message({sender,conversationid,text})
    try{
        const savedmessage = await newmessage.save()
        return res.status(200).json(savedmessage)
    }catch(err){
        return res.status(500).json(err)
    }   
}

const getmessages = async (req,res)=>{
    const {conversationid} = req.params
    console.log(conversationid)
    try{
    const messages = await Message.find({conversationid:conversationid})
    console.log(messages)
    return res.status(200).json(messages)
    }
    catch(err){
        return res.status(500).json(err)
    }  
}

module.exports = {addmessage,getmessages}