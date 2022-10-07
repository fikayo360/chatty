
import "./edit.css"
import {getStorage, ref, uploadBytesResumable,getDownloadURL} from "firebase/storage"
import app from "../../firebase"
import axios from "axios"
import { useDispatch,useSelector } from "react-redux"
import { updateprofile } from "../../redux/userRedux"
import { useState } from "react";

const Editprofile = () => {
   const [city,setcity] = useState("")
   const [sex,setsex] = useState("")
   const [relationship,setrelationship] = useState("")
   const [file,setFile] = useState(null)
   const [toggleview,settoggleview] = useState(false)
   const [notification,setnotification] = useState("")
   const token = localStorage.getItem('token')
   axios.defaults.headers.common['Authorization']  = `Bearer ${token}`
   const ToggleState = () =>{
    settoggleview((prev)=> !prev)
  } 
  const dispatch = useDispatch()
  const username = useSelector((state) => state.user.username);
  const ppic = useSelector((state) => state.user.profilepic);

   const completeprofile = async () => {
            const filename = new Date().getTime() +file.name;
            const storage = getStorage(app);
            const storageRef = ref(storage, filename);
            const uploadTask = uploadBytesResumable(storageRef, file);

            settoggleview(true)
            setnotification("uploading please wait")
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                switch (snapshot.state) {
                    case "paused":
                    console.log("Upload is paused");
                    break;
                    case "running":
                    console.log("Upload is running");
                    break;
                    default:
                }
                },
                (error) => {
                // Handle unsuccessful uploads
                },
                () => {
                
                getDownloadURL(uploadTask.snapshot.ref).then((profilepic) => {
                    dispatch(updateprofile({city,profilepic,sex,relationship}))
                    const payload = { city, profilepic,sex,relationship };
                    console.log(payload)
                     axios.post('https://fksocial.onrender.com/v1/user/completeprofile',payload).then((response)=>{
                        setsex("")
                        setrelationship("")
                        setcity("")
                        setnotification(response.data)
                     }) 
                });
                
                }
            );
            }
            
    return (
        <div className="editprofilecontainer">
             <div id="editprofileheader">
                <span id = "phtxt">EditProfile</span>
                {ppic ?
                <div id = "phpic">
                <img id="phpicc" src={ppic} />
                </div>
                :<div id = "nopic">
                    <span id="nopictxt">{username.charAt(0).toUpperCase()}</span>
                </div>}
            </div>

            <span id="username">{username}</span>
            {ppic?
             <div id="profilepiccontainer">
              <img id="ppc" src={ppic} />
              <div className="filecontainer">
                    <label for="photo">
                    <img id="img" src="icons/pluss.svg" />
                    </label>
                <input id="photo" type="file" 
                 name="photo" onChange={(e) => setFile(e.target.files[0])} className="display-none"/>
                </div>
                <span onClick={completeprofile} id="save">SAVE </span>
            </div>:
            <div id="ppcno">
                <span id="ppcnotxt">{username.charAt(0).toUpperCase()}</span>
              <div className="filecontainer">
                    <label for="photo">
                    <img id="img" src="icons/pluss.svg" />
                    </label>
                <input id="photo" type="file" 
                 name="photo" onChange={(e) => setFile(e.target.files[0])} className="display-none"/>
                </div>
                <span onClick={completeprofile} id="save">SAVE </span>
            </div>}

            <div id="profiledetails">
                <span id="infotxt">Editprofile</span>
                <div className="info">
                    <input type="text" value={city} onChange={(e)=>setcity(e.target.value)} className="edit" placeholder="edit city"/>
                </div>
                <div className="info">
                    <input type="text" value={sex} onChange={(e)=>setsex(e.target.value)} className="edit" placeholder="edit sex"/>
                </div>
                <div className="info">                   
                   <input type="text" value={relationship}  onChange={(e)=>setrelationship(e.target.value)} className="edit" placeholder="edit relationship"/>
               </div>
            </div>
             <div className={toggleview === true?"messagepanel":"vanish"}>
            <span id = "errortxt">{notification}</span>
            <span id="x" onClick={ToggleState} >X</span>
            </div>
        </div>
    )
    }

export default Editprofile
