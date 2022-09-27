const Conversation = require("../models/conversation.model")
const User = require("../models/user.model")

const getconversations  = async (req,res) => {
try{
  const id =  req.id
  const conversations = await Conversation.find({ members: { $in: [id] }})
  return res.status(200).json(conversations)
  }
  catch(err){
  return res.status(500).json(err)
  }
  }

const generateconversations = (req,res) => {
    const userfriends = []
    //get sesssion user friends
    const user = User.findById(req.id)
    console.log(user)
    user.friends.foreach((item) => {
        userfriends.push(item)
    })
    userfriends.forEach(friend=>{
      let conversation =   new Conversation({
            userid:req.id,
            members:[req.id,friend]
        })
      conversation.save()  
    })
    return res.status(200).json("conversations generated") 
}

module.exports = {getconversations,generateconversations}