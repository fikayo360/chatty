import "./friend.css"
import axios from "axios";
import { useEffect, useState } from "react";


const Friend = ({conversation,currentuser}) => {
    
    const [user,setuser] = useState({})
    const [firstchar,setfirstchar] = useState("")
    const friendid = conversation.members.find((m)=> m !== currentuser._id)

    const getconversationfriend = async () => {
        try{
            const res = await axios.post('http://localhost:5000/v1/user/getConversationfriend',{friendid})
            console.log(res.data.others)
            setuser(res.data.others)
            setfirstchar(res.data.others.username)
        }catch(err){
            console.log(err.response.data)
        }
    }

    useEffect(()=>{
        console.log(friendid,currentuser,firstchar)
        getconversationfriend()
    },[conversation,currentuser])

    return(
     <div className="friendscont">
        {user.profilepic?
        <img className="friendimg" src={user.profilepic}/> :
        <div classname="hide" id="picalt"><span id="picalttxt">{firstchar.charAt(0).toUpperCase()}</span></div>
        }
        <span className="friendname">{user.username}</span>
    </div>
    )
}

export default Friend