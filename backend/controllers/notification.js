const Notification = require("../models/notification.model")

const addnotification = async(req,res)=>{
    const {userid,message,individualpic,receiverid} = req.body
    const newNotification = new Notification({userid,message,individualpic,receiverid} )
    try{
        const saved = await newNotification.save()
        return res.status(200).json(saved)
    }catch(err){
        return res.status(500).json(err)
    }   
}

const getnotification = async (req,res)=>{
    const id = req.params.id
    console.log(id)
    try{
    const notifications = await Notification.find({userid:id})
    console.log(notifications)
    return res.status(200).json(notifications)
    }
    catch(err){
        return res.status(500).json(err)
    }  
}

module.exports = {getnotification,addnotification}