import "./notifications.css"
import axios from "axios"
import { useState,useEffect} from "react"
import { format } from "timeago.js";
import { useRef } from "react"
import { useSelector } from "react-redux"
import { io } from "socket.io-client";

const Notifications = () => {
    const [nots,setnots] = useState([])
    const token = localStorage.getItem('token')
    const [arrival,setArrival] = useState({})
    axios.defaults.headers.common['Authorization']  = `Bearer ${token}`
    const socket = useRef();
    const user = useSelector((state) => state.user);
    
    
    useEffect(()=>{
        socket.current = io("https://fksocialws.onrender.com");
        },[])

        useEffect(()=>{
            socket.current.on("getnotifications",(data) => {
                console.log(data)
                setArrival({
                    message:data.message,
                    individualpic:data.individualpic,
                    createdAt:Date.now()
                })
            })
        },[])

        useEffect(() => {
            setnots((prev) => [...prev, arrival])
        }, [arrival])

        const getNotifications = async() => {
            try{
                const res = await axios.get('https://fksocial.onrender.com/api/v1/notifications/all/' + user._id)
                console.log(res)
                setnots(res.data)
            }catch(err){
                console.log(err.response.data)
            }
        }

    useEffect(()=> {
        getNotifications()
    },[])
   
   

    
    return(
        <div classname="notificationcontainer">
             <div id="notheader">
                <span id = "notheadertxt">Notifications</span>
                <span id="noticon"> <img src="icons/notification.svg" width="30" height="30" /></span>
            </div>
            <div id = "body">
                <div id="notbody">
                <div id="notbodyH">
                    <span id="htxt">All notifications <img className="g" src="icons/greencheck.png" width="30" height="30"/><img className="g" src="icons/greencheck.png" width="30" height="30"/></span>
                </div>
                {
                    nots ?
                    nots.map((item)=> (
                        <div id="not" key={item._id}>
                        <div id='bluedot'></div>
                        <div id="mandd">
                            <span id="txt">{item.message}</span>
                            <span id="date">{format(item.createdAt)}</span>
                        </div>

                        {
                            item.individualpic?
                            <div id="imgCont">
                            <img id="imgcontp" src={item.individualpic} />
                           </div>:
                           <div id="noimgCont">
                            <span id="ntxt">N</span>
                           </div>
                        }
                        
                    </div>
                    )):(<div id="nonot">
                        <span id="nonotxt"> no notifications yet</span>
                       </div>)
                }
                </div>
            </div>
        </div>
    )
}

export default Notifications