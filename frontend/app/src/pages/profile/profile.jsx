
import "./profile.css"
import axios from "axios"
import { removefriend } from "../../redux/userRedux";
import { useDispatch,useSelector } from "react-redux";
import {useState,useEffect} from "react"
import { Link } from "react-router-dom"
import { io } from "socket.io-client";
import { useRef } from "react"

const Profile = () => {
    const [following,setfollowing] = useState([])
    const [notification,setnotification] = useState("")
    const [user,setuser] = useState({})
    const [toggleview,settoggleview] = useState(false)
    const [first,setfirst] = useState("")
    const dispatch = useDispatch()
    const friends = useSelector((state) => state.friends);
    const socket = useRef();
    const userr = useSelector((state)=>state.user)
    const ToggleState = () =>{
        settoggleview((prev)=> !prev)
    }

    const token = localStorage.getItem('token')
    axios.defaults.headers.common['Authorization']  = `Bearer ${token}`

    useEffect(()=>{
        socket.current = io("https://fksocialws.onrender.com")
        },[])
        
    const getprofile = async() => {
        try{
            const response = await axios.get('https://fksocial.onrender.com/v1/user/profile')
            setuser(response.data.userdetails)
            setfirst(response.data.userdetails.username)
            setfollowing(response.data.userfriends)
        }catch(err){
            console.log(err)
        }
    }
    useEffect(()=>{
        getprofile()
    },[])
   
    // unfollow by id 
    const unfollow = async(friendid) => {
        const payload = {
            userid:friendid,
            message: `${user.username} unfollowed you`,
            individualpic: user.profilepic,
            receiverid:friendid
          }

        try{
            const response = await axios.post('https://fksocial.onrender.com/v1/user/removefriend/' + friendid)
            if(response.status === 200){
                const createNotification = await axios.post('https://fksocial.onrender.com/api/v1/notifications/add',payload)
                console.log(createNotification.data)
                socket.current.emit("sendnotification", {
                    message: `${userr.username} unfollowed you`,
                    individualpic: userr.profilepic,
                    receiverid:friendid
                });
            }
            dispatch(removefriend(friendid))
            console.log(friends.length)
            setnotification(response.data)
            following.filter(item => item._id !== friendid)
            getprofile()
        }catch(err){
             setnotification(err.response)
        }
    }

    return(
       <div className="profilecontainer">
             <div className={toggleview === true?"errorcont":"none"}>
            <span id = "errortxt">{notification}</span>
            <span id="x" onClick={ToggleState} >X</span>
            </div>
            <div id="profileheader">
                <span id = "phtxt">MyProfile</span>
                {user.profilepic ?
                <div id = "phpic">
                <img id="phpicc" src={user.profilepic} />
                </div>
                :<div id = "nopic">
                    <span id="nopictxt">{first[0]?.toUpperCase()}</span>
                </div>}
            </div>

            <div id="details">
            <span id="username">{user.username}</span>
            {user.profilepic?
             <div id="profilepiccontainer">
              <img id="ppc" src={user.profilepic} />
              <div id="edit">
                <Link to="/edit">
                <img id="editicon" src="icons/edit.png" />
                </Link>
              </div>
            </div>:
            <div id="ppcno">
                <span id="ppcnotxt">{first[0]?.toUpperCase()}</span>
                <div id="edit">
                <Link to="/edit">
                <img id="editicon" src="icons/edit.png" />
                </Link>
              </div>
            </div>}
            <div id="quickDetails">
                <span id="quickDetailsHeader">
                    Info
                </span>
                <div className="detail">
                    <span className="infokey"><span className="infokeyicon"><img src="icons/mail.png" width="40" height="40" /></span>Email</span>
                    <span className="infovalue">{user.email}</span>
                </div>
                <div className="detail">
                    <span className="infokey"><span className="infokeyicon"><img src="icons/created.png" width="40" height="40" /></span>Joined</span>
                    <span className="infovalue">{user.createdAt?user.createdAt.slice(0,10):"********"}</span>
                </div>
                <div className="detail">
                    <span className="infokey"><span className="infokeyicon"><img src="icons/city.png" width="40" height="40" /></span>city</span>
                    <span className="infovalue">{user.city?user.city:"********"}</span>
                </div>
                <div className="detail">
                    <span className="infokey"><span className="infokeyicon"><img src="icons/sex.png" width="40" height="40" /></span>sex</span>
                    <span className="infovalue">{user.sex?user.sex:"********"}</span>
                </div>
                <div className="detail">
                    <span className="infokey"><span className="infokeyicon"><img src="icons/relationship.png" width="40" height="40" /></span>relationship</span>
                    <span className="infovalue">{user.relationship?user.relationship:"********"}</span>
                </div>
            </div>

            <div className="userfriends">
            <div id="f">  
            <span id="following">FOLLOWING</span>
            {following?following.map((item)=> (
                 <div className="userfriend" key={item._id}>
                    {item.profilepic?<img src="images/1.jpg" className="followingimg"/>:
                    <div className="noprofile">
                      <span className="noprofiletxt">{item?.username[0].toUpperCase()}</span>
                    </div>
                    }
                 
                 <span className="followingusername"> {item.username} </span>
                 <button className="unfollow" onClick={()=>unfollow(item._id)}>unfollow</button>
                </div>
            )):(
                <div classname="nofriends">
                    <span>no friends yet </span>
                </div>
            )}
            </div>
            </div>
            </div>
        </div>
    )
}

export default Profile

