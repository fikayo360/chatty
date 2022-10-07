
import "./home.css"
import Navbar from "../../components/navbar/navabar"
import { useState,useEffect } from "react"
import Message from "../../components/message/message"
import Friend from "../../components/friend/friend"
import Online from "../../components/online/online"
import { io } from "socket.io-client";
import { useRef } from "react"
import { useDispatch,useSelector } from "react-redux";
import {update,clearall} from "../../redux/userRedux"
import axios from "axios"
import { addnotification } from "../../redux/notifications";
import { Link } from "react-router-dom";

const Home = () => {
    const leftRef = useRef();
    const rightRef = useRef();
    const centerRef = useRef();
    const socket = useRef();
    const user = useSelector((state) => state.user);
    const count = useSelector((state)=>state.notification.notifications.length)
    const username = useSelector((state)=> state.user.username)
    const [onlineusers,setonlineusers] = useState([])
    const [online,setonline] = useState([])
    const [conversations,setconversations] = useState([])
    const [messages,setmessages] = useState([])
    const [newMessage,setnewMessage] = useState("")
    const [arrivalMessage,setArrivals] = useState(null)
    const [arrivalnot,setarrivalnot] = useState([])
    const [currentChat,setCurrentChat] = useState({})
    const token = localStorage.getItem('token')
    axios.defaults.headers.common['Authorization']  = `Bearer ${token}`
    const dispatch = useDispatch()
    const [over,setover] = useState(false)
    const [onlineo,setonlineo] = useState(false)
    
    

    useEffect(() => {
        socket.current = io("https://fksocialws.onrender.com");
         socket.current.on("getMessage",(data) => {
            console.log(data)
            setArrivals({
                sender:data.sender,
                text:data.text,
                createdAt:Date.now()
            })
        })
      }, []);
      
      useEffect(()=>{
        socket.current.on("getnotifications",(data) => {
            arrivalnot.push(data)
            dispatch(addnotification(data))
           console.log(arrivalnot)
        })
      },[socket])

      const refresh = async() => {
        const formdata = {username}
        try{
            const res = await axios.post('https://fksocial.onrender.com/v1/user/search',formdata)
            const {email,_id,createdAt,friends,city,relationship,profilepic,sex} = res.data.others
            dispatch(update({username,email,_id,friends,createdAt,city,relationship,profilepic,sex}))
        }catch(err){
            console.log(err.response.data)
        }
    }

    useEffect(()=>{
        refresh()
    },[])

      useEffect(() => {
        arrivalMessage &&
        currentChat?.members.includes(arrivalMessage.sender) &&
          setmessages((prev) => [...prev, arrivalMessage]);
      }, [arrivalMessage,currentChat]);

      useEffect(()=>{ 
        socket.current.emit("addUser",user._id)
        socket.current.on("getUsers",(users) => {    
            setonlineusers(user.friends.filter((f) => users.some((u) => u.userId === f)) )
        })
    },[user])

    const getconversations = async() => {
        try{
            const res = await axios.get('https://fksocial.onrender.com/api/v1/conversation/allconvo')
            setconversations(res.data)
        }catch(err){
            console.log(err.response.data)
        }
    }

    const getonlineusers = async()=>{
        try{
            let data = {onlineusers}
            const res = await axios.post('https://fksocial.onrender.com/v1/user/online',data)
            setonline(res.data)
        }catch(err){
            console.log(err.response.data)
        }
    }

    useEffect(()=>{
        getconversations()
    },[user._id])
    
    useEffect(()=>{
        getonlineusers()
    },[onlineusers])

      const getMessages = async () => {
        let conversationid = currentChat?._id
    try {
        const res = await axios.get('https://fksocial.onrender.com/api/v1/messages/' + conversationid);
        setmessages(res.data);
    } catch (err) {
        console.log(err);
    }
    };
    
     //get messages
     useEffect(() => {
        getMessages();
    }, [currentChat]);

    const createMessage = async (e) => {
        e.preventDefault();
        const message = {
        sender: user._id,
        text: newMessage,
        conversationid: currentChat._id,
        };

        const receiverId = currentChat.members.find(
        (member) => member !== user._id
        );

        socket.current.emit("sendMessage", {
            sender: user._id,
            receiverId,
            text: newMessage,
        });
        
        try {
        const res = await axios.post('https://fksocial.onrender.com/api/v1/messages/add', message);
        setmessages([...messages, res.data]);
        setnewMessage("");
        } 
        catch (err) {
        console.log(err.response.data);
        }
        
    };

    const setcurrent = (c) => {
        setCurrentChat(c)
        leftRef.current.classList.add("notactive")
        rightRef.current.classList.add("notactive")
        centerRef.current.classList.add("active")
    }

    const closemessage = () => {
        centerRef.current.classList.remove("active")
        leftRef.current.classList.remove("notactive")
    }

    const openoverlay = () => {
        setover(true)
    }

    const closeoverlay = () => {
        setover((prev)=> !prev)
    }

    const onlineoverlay = () => {
        setonlineo(true)
    }
    const closeonline = () => {
        setonlineo((prev) => !prev)
    }

    const reset = () => {
        dispatch(clearall())
    }

    return (
        <div className="homecontainer">
        <div className={over === true?"overlayh":"overlayn"} >
            <div className="overlayheader">
                <span id="overlayheadertxt">FKSOCIAL</span>
                <img id="overlayicon" onClick={closeoverlay} src="icons/x.png" />
            </div>
            <div className="overlaybody">
                <ul>
                    <li><Link  to="/findfriend"> <span className="overlaybodyitems">SEARCH</span>  </Link> <img className="overlaybodyimg" src="icons/search.svg" /></li>
                    <li><Link  to="/notifications"> <span className="overlaybodyitems">NOTIFICATIONS</span> </Link>  <img className="overlaybodyimg" 
                     src="icons/notification.svg" /><span id="nnum">{count}</span></li>
                    <li><Link  to="/profile"> <span className="overlaybodyitems">PROFILE</span>  </Link> <img className="overlaybodyimg"  src="icons/profile.svg" /></li>
                    <li><span className="overlaybodyitems" onClick={onlineoverlay}>ONLINE</span> <img className="overlaybodyimg"  src="icons/online.png" /></li>
                    <li><span className="overlaybodyitems" onClick={reset}>LOGOUT</span> <img className="overlaybodyimg"  src="icons/logout.svg" /></li>
                </ul>
            </div>
        </div>
        <div className={onlineo === true?"onlineo":"onlinen"}>
        <img src="icons/left.png" id="onlineimg" onClick={closeonline} />
        <span id="hrighttxt">online</span>
            {online.length? (online.map(user=>(
            <Online key={user._id} user={user} />
            ))):(<div id="nuod"><span id="nuo">no user online</span></div>)}
        </div>

         <Navbar c={count} open={openoverlay} reset={reset} />
         <div className="wrapper">
            <div ref={leftRef} className="hleft">
                <span id ="hlefttxt">conversations</span>
                {conversations.length ? (conversations.map(conversation=>(
                    <div onClick={() => setcurrent(conversation) }>
                    <Friend key={conversation._id} conversation={conversation} currentuser={user} />
                    </div>
                ))):(<div className="noconvoo">
                     <img id="notimg" src="illustrations/reading.png"/>
                    <span id="nfy"> no friends yet you can find some here </span>
                    <Link to="/findfriend"><button id="sfriends">search friends</button></Link>
                    </div>)}
            </div>

            <div ref={centerRef} className="center">
            <div className="top">
            <img src="icons/left.png" id="messageback" className="active" onClick={closemessage}/>
                {messages.map((message)=>(
                    <div>
                    <Message key={message._id} message={message} own={message.sender === user._id} />
                    </div>
                ))}
            </div>
            <div className="chatBoxBottom">
                  <textarea className="chatMessageInput" placeholder="HI THERE" 
                   value={newMessage} onChange={(e)=>setnewMessage(e.target.value)} ></textarea>
                  <button onClick={createMessage} className="chatSubmitButton">
                    Send
                  </button>
                </div>
            </div>
            <div ref={rightRef} className="hright">
            <span id="hrighttxt">online</span>
            {online.length? (online.map(user=>(
            <Online key={user._id} user={user} />
            ))):(<div id="nuod"><span id="nuo">no users online</span></div>
            )}
            </div>
            </div>
        </div>
    )
}

export default Home 

