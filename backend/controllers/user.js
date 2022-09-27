
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/user.model")
const Conversation = require("../models/conversation.model");

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

const signup = async(req,res)=>{
    const {username,email,password} = req.body

    const userexists = await User.findOne({username})
    if (userexists){
      return res.status(500).json("user already exists")
    } 
    const emailexists = await User.findOne({email})
    if (emailexists){
      return res.status(500).json("user already exists")
    }
    
    if (!email && !username && !password){
       return  res.status(500).json("ensure fields are not empty")
    }

    else if (validateEmail(email) === false){
        return res.status(500).json("invalid email")
    }

    const newUser = new User({
        email,
        username,
        password: bcrypt.hashSync(password, 10),
    })
    
    try{
        const savedUser = await newUser.save()
            console.log(savedUser + "added")
            jwt.sign({
                id:savedUser._id,
                email: savedUser.email,
              }, process.env.SECRET, (err, token) => {
                if(err) throw err;
                res.send({token})
              })
    }
    catch(err){
        res.status(500).json(err)
    }
}

//login
const login = async (req,res) => {
  let {username,password} = req.body

  if (!username  && !password){
    return res.status(500).json("pls ensure fields are not empty ")
  }

    try{
            const user = await User.findOne({username})
           
            if (!user){
              return res.status(500).json("that user does not exist")
            }
           
             else if(!bcrypt.compareSync(password,user.password)){
              return res.status(500).json("invalid password")
            }
            
              ({password,...others} = user._doc)
              console.log(others)
                jwt.sign({
                  id: user._id,
                }, process.env.SECRET, (err, token) => {
                  if(err) throw err;
                  res.send({
                    token,
                    others
                  })
                })
       }
      catch(err){
        return res.status(500).json(err)
      }
}

// find user by ussername
const getusername = async(req,res) => {
  const {username} = req.body
  console.log(username)
  if(!username){
    return res.status(500).json("please enter a user")
  }
try{
  const founduser = await User.findOne({username})
  if (founduser === null){
    return res.status(500).json("that user does not exist")
  }
  console.log(founduser)
  const {password,...others} = founduser._doc
    return res.status(200).json({others})
}
catch(err){
    return res.status(500).json(err)
  }
}

// find user by id
const getuserbyid = async (req,res) => {
const id =  req.id

try {
const user = await User.findById({_id:id})
const {password,...others} = user._doc
let userdetails = others
let friends = user.friends
let userfriends = []
console.log(friends)
for (let i=0;i<friends.length;i++){
  let found =  await User.findById({_id:friends[i]})
  const {password,...others} = found._doc
  console.log(others)
  userfriends.push(others)
}
return res.status(200).json({userfriends,userdetails})
}
catch(err){
  return res.status(500).json(err)
}
}

const getConversationfriend = async (req,res)=>{
const {friendid} = req.body
try{
const user = await User.findById({_id:friendid})
const {password,...others} = user._doc
return res.status(200).json({others})
}catch(err){
return res.status(500).json(err)
}
}

// add to frind list
const addfriend = async(req,res) => {
  const friendid = req.params.friendid
  const _id = req.id
  if (friendid === _id){
    return res.status(500).json("cant add urself")
  }
  try{
      let friend = await User.findById({_id:friendid})
      let sessionuser = await User.findById({_id})
     if(sessionuser.friends.includes(friendid) || friend.friends.includes(sessionuser)){
      return res.status(500).json("is already your friend")
    }else{
      sessionuser.friends.push(friendid)
      sessionuser.save()
      friend.friends.push(_id)
      friend.save()
      const newconvo = new Conversation({
        userid:_id,
        members:[]
      })
      newconvo.members.push(_id)
      newconvo.members.push(friendid)
      console.log(newconvo,sessionuser,friend)
      newconvo.save()      
      return res.status(200).json({msg:"user added"})
    }
    }
  catch(err){
    return res.status(500).json(err)
  }
}

 const onlineusers = async(req,res) => {
  const {onlineusers} = req.body
  let foundusers = []
  try{
    for (let i=0;i<onlineusers.length;i++){
      let found =  await User.findById({_id:onlineusers[i]})
      const {password,...others} = found._doc
      foundusers.push(others)
    }
    return res.status(200).json(foundusers)
  }catch(err){
    return res.status(500).json(err)
  }
 }

// remove frm friend list 
const removefriend = async(req,res) => {
  const {friendid} = req.params
  const _id = req.id
  try{
    let sessionuser = await User.findById({_id})
    let friend = await User.findById({_id : friendid})
    if (sessionuser.friends.includes(friendid)){
      let newusers = sessionuser.friends.filter(item => item != friendid )
      sessionuser.friends = newusers
      sessionuser.save()
      if (friend.friends.includes(_id)){
        let newfriend = friend.friends.filter( item => item != _id)
        friend.friends = newfriend
        friend.save()
      }
      const conversations = await Conversation.find( { members: { $all: [ friendid, _id ] } } )
      let convoId = conversations[0]._id
      console.log(convoId)
      const doc = await Conversation.findByIdAndDelete(convoId)
      console.log("deleted")
      return res.status(200).json("friend removed")
    }else{
      return res.status(200).json("you dont follow this user")
    }
  }catch(err){
    return res.status(500).json(err)
  }
}

// complete profile
const completeprofile = async(req,res) => {
  const _id = req.id
   const {city,sex,relationship,profilepic} = req.body
   try{
    let user = await User.findById({_id})
    user.city = city
    user.sex = sex
    user.relationship = relationship
    user.profilepic = profilepic
    user.save()
    return res.status(200).json("profile updated")
   }catch(err){
    return res.status(500).json(err)
   }
}

// generate conversations
const generateconversations = async(req,res) => {
  const {username} = req.body
  //let frienddetails = []
  try{
    // find user
  let user = await User.findOne({username})
  console.log(user)
  // get id of each user friends
  user.friends.map(async(friend) => {
    let intermediate = await User.findById(friend)
    const {_id,username,profilepic} = intermediate
    let i = new Conversation({
      members:[user._id,_id],
      friendname:username,
      friendpic:profilepic
    })
    i.save()
  })
  return res.status(200).json("saved")
  
  let membersarr = [_id,sample._id]
  console.log(membersarr)
  const convo = new Conversation({
    members:membersarr,
    friendname:sample.username,
    friendpic:sample.profilepic
  })
  let saved = await convo.save()
  return res.status(200).json("saved")
 
  frienddetails.map(async(item)=> {
    const newconvo = new Conversation({
      friendname:item.username,
      friendpic:item.profilepic
    })
    const saveconvo = await newconvo.save()
    return res.status(200).json(saveconvo)
  })

}
  catch(err){
    return res.status(500).json(err)
  } 
}

module.exports = {
  signup,login,getusername,addfriend,
  removefriend,completeprofile,
  generateconversations,getuserbyid,getusername,onlineusers,getConversationfriend
}