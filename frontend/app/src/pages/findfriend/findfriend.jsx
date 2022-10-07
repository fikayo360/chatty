
import "./findfriend.css"
import { useState,useEffect} from "react"
import { useDispatch,useSelector } from "react-redux";
import { addfriend } from "../../redux/userRedux";
import { io } from "socket.io-client";
import axios from "axios"
import { useRef } from "react"


const Finduser = () => {
        const [username,setusername] = useState("")
        const [fusername,setfusername] = useState("")
        const [fpic,setfpic] = useState("")
        const [friendid,setfriendid] = useState("")
        const token = localStorage.getItem('token')
        const [errortxt,seterrortxt]= useState("")
        const [toggleview,settoggleview] = useState(false)
        const user = useSelector((state)=>state.user)
        const dispatch = useDispatch()
        const friends = useSelector((state) => state.friends);
        axios.defaults.headers.post['Authorization'] = `Bearer ${token}`
        const socket = useRef();

        const ToggleState = () =>{
            settoggleview((prev)=> !prev)
        }

        useEffect(()=>{
            socket.current = io("https://fksocialws.onrender.com")
            },[])
        
        const found = async() => {
            const formdata = {username}
            try{
            const res = await axios.post('https://fksocial.onrender.com/v1/user/search',formdata)
            console.log(res)
            setfusername(res.data.others.username)
            setfpic(res.data.others.profilepic)
            setfriendid(res.data.others._id)
            }catch(err){
                console.log(err.response)
                seterrortxt(err.response.data)
                settoggleview(true)
        }
    }
    
   const  follow = async() => {
    const payload = {
        userid:friendid,
        message: `${user.username} followed you`,
        individualpic: user.profilepic,
        receiverid:friendid
      }
      
        try{
            let res = await axios.post('https://fksocial.onrender.com/v1/user/addfriend/' + friendid)
            console.log(res.data)
            const createNotification = await axios.post('https://fksocial.onrender.com/api/v1/notifications/add',payload)
            socket.current.emit("sendnotification", {
                message: `${user.username} followed you`,
                individualpic: user.profilepic,
                receiverid:friendid
            });
            dispatch(addfriend(friendid))
            seterrortxt(res.data.msg)
            settoggleview(true)
           
        }catch(err){
            console.log(err.response.data)
            seterrortxt(err.response.data)
            settoggleview(true)
        }
    }

    return(
        <div className="fcontainer">
            <div id="searchheader">
                <span id = "notheadertxt">SEARCH</span>
                <span id="noticon"> <img src="icons/search.svg" width="30" height="30" /></span>
            </div>
            <div className="searchsection">
            <div className="searchcontainer">
                <img alt="search" id="searchicon" src="/icons/search.svg" />
                <input type="text" placeholder="Enter username" value={username} 
                onChange={(e)=>setusername(e.target.value)} className="searchinput" />
            </div>
            <button id="searchbtn" onClick={found}>
                search
            </button>
            </div>
            
            {fusername?(
            <div className="resultsection">
                <span id="resulttxt"> Results </span>
                <div className="user">
                    {fpic? <img alt="profilepic" src={fpic} className="userimg"/>:(<div className="nofpic">
                        {fusername.charAt(0).toUpperCase()}
                    </div>)}
                    <span className="username"> {fusername} </span>
                    <button onClick={follow} className="addbtn">follow</button>
                </div>
            </div>
        ):(<div className="noresult">
            <img alt="no img" id="noresimg" src="illustrations/search.svg" />
        </div>)}
        <div className={toggleview === true?"messagepanel":"vanish"}>
        <span id = "paneltxt">{errortxt}</span>
        <span id="panelx" onClick={ToggleState} >X</span>
        </div>
        </div>
    
    )}

export default Finduser
