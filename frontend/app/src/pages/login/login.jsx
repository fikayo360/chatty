
import "./login.css"
import axios from "axios"
import { useState} from "react"
import { useNavigate } from "react-router-dom";
import {update} from "../../redux/userRedux"
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const Login = () => {
    const [username,setusername] = useState("")
    const [password,setpassword] = useState("")
    const [errortxt,seterrortxt]= useState("")
    const [toggleview,settoggleview] = useState(false)
    let [loading, setLoading] = useState(false);
    let [color, setColor] = useState("black");
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const ToggleState = () =>{
        settoggleview((prev)=> !prev)
    }
    
    const override =  {
        positon:"absolute",
        left: "195px",
        display: "block",
        margin: "0",
        borderColor:"#256aa7 #d10c0c transparent"
      };

    const handlelogin = async(e) => {
        setLoading(true)
        e.preventDefault()
        if (!password || !username){
            settoggleview(true)
            seterrortxt("fields cant be blank")
            setLoading(false)
            return
        }
            try{
            let formdata =  {username,password}
            const res = await axios.post("https://fksocial.onrender.com/v1/user/login",formdata)
            setLoading(false)
            const {email,_id,createdAt,friends,city,relationship,profilepic,sex} = res.data.others
            dispatch(update({username,email,_id,friends,createdAt,city,relationship,profilepic,sex}))
            localStorage.setItem('token',res.data.token)
            setusername("")
            setpassword("")
            navigate('/home')
            }catch(err){
                console.log(err.response.data)
                seterrortxt(err.response.data)
                settoggleview(true) 
                setLoading(false)
            }
    }
 
return(
    <div className="lcontainer">
        <div id="lmobheader">
        <span id="lmobheadertxt">FKSOCIAL</span>
        <span id="lmobheaderlink"><Link  to="/"> Register </Link></span>
        </div>
         <div className={toggleview === true?"errorcont":"none"}>
            <span id = "errortxt">{errortxt}</span>
            <span id="x" onClick={ToggleState} >X</span>
        </div>
        <div className="left">
            <div className="left-top">
                <h1 id="firstheading">
                    Fksocial
                </h1>
                <p id="left-para">connect and chat with friends  </p>
            </div>
            
        </div>

        <div className="right">
            <div className="formwrap">
                <form className="forrm">
                    <input className="forminput" value={username} onChange={(e)=>setusername(e.target.value)}
                    type="text" placeholder="username" />
                    <input className="forminput" value={password} onChange={(e)=>setpassword(e.target.value)}
                    type="password" placeholder="password" />
                    <div className="btnwrap">
                        <button id="loginbtn" onClick={handlelogin}> <ClipLoader color={color} loading={loading} cssOverride={override} size={30} />Login</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
)
}

export default Login

