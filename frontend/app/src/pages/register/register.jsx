import "./register.css"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"
import ClipLoader from "react-spinners/ClipLoader";


const Register = () => {
    const navigate = useNavigate()
    const [username,setusername] = useState("")
    const [email,setemail] = useState("")
    const [password,setpassword] = useState("")
    const [confirm,setconfirm] = useState("")
    const [errortxt,seterrortxt]= useState("")
    const [toggleview,settoggleview] = useState(false)
    let [loading, setLoading] = useState(false);
    let [color, setColor] = useState("black");
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

    const handleregister = async(e) => {
        setLoading(true)
        e.preventDefault()
        if (password !== confirm){
            settoggleview(true)
            seterrortxt("ensure passwords match")
            setLoading(false)
            return
        }
            try{
            let formdata =  {username,email,password}
            const res = await axios.post("http://localhost:5000/v1/user/signup",formdata)
            setLoading(false)
            console.log(res.data)
            localStorage.setItem('token',res.data.token)
            setusername("")
            setemail("")
            setpassword("")
            setconfirm("")
            navigate('/login')
            }
            catch(err){
                seterrortxt(err.response.data)
                settoggleview(true)
                setLoading(false)
            }
        
    }

return(
    <div className="rcontainer">
        <div className={toggleview === true?"errorcont":"none"}>
            <span id = "errortxt">{errortxt}</span>
            <span id="x" onClick={ToggleState} >X</span>
        </div>
        <div className="rleft">
            <div className="rleft-top">
                <h1 id="rfirstheading">
                    FKSOCIAL
                </h1>
                <p id="rleft-para">connect and chat with friends around the world </p>
            </div>
            <div className="rleft-bottom">
                <span id="rextratxt"> already a user??? <Link id="alreadyau" to="/login"> LOGIN </Link></span>
            </div>
            
        </div>

        <div className="rright">
        <div id="mobheader">
        <span id="mobheadertxt">FKSOCIAL</span>
        <span id="mobheaderlink"><Link  to="/login"> LOGIN </Link></span>
        </div>
            <div className="rformwrap">
                <form className="rforrm">
                <input className="rforminput" value={username} onChange={(e)=>setusername(e.target.value)} type="text" placeholder="username" />
                    <input className="rforminput" value={email} onChange={(e)=>setemail(e.target.value)} type="email" placeholder="emailaddress"/>
                    <input className="rforminput" value={password} onChange={(e)=>setpassword(e.target.value)} type="password" placeholder="password" />
                    <input className="rforminput" value={confirm} onChange={(e)=>setconfirm(e.target.value)} type="password" placeholder="confirm password"/>
                    <div className="rbtnwrap">
                        <button id="rsignupbtn" onClick={handleregister}> <ClipLoader color={color} loading={loading} cssOverride={override} size={30} /> Signup</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
)
}

export default Register