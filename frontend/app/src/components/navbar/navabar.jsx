import "./navbar.css"
import { Link } from "react-router-dom"
import { useDispatch,useSelector } from "react-redux";
import { clearnots } from "../../redux/notifications";

const Navbar = ({c,open,reset}) => {
    const dispatch = useDispatch()

    const clearnotifications = () => {
        dispatch(clearnots())
    }

    return(
        <div className="navcontainer">
            <div className="left-items">
                <span id="left-txt"> FKSOCIAL </span>
                <div className="hamburger" onClick={open}>
                    <img className="hamicon" src = "icons/menu.png" />
                </div>
            </div>
          
            <div className="right-items">
            <Link to="/findfriend">
                <div className="searchiconcont">
                    <img className="iconimg" src="icons/search.svg"  />
                </div>
                </Link>
                <Link to="/notifications">
                <div onClick={clearnotifications} className="notificationiconcont">
                    <div className="notnum">
                        <span id="notnumm">{c}</span>
                    </div>
                    <img className="iconimg" src="icons/notification.svg" />
                </div>
                </Link>
                <Link to="/profile">
                <div className="profileimgcont">
                    <img className="iconimg" src = "icons/profile.svg" />
                </div>
                </Link>
                <div className="logout" onClick={reset}>
                    <img className="iconimg" src="icons/logout.svg" />
                </div>
            </div>
        </div>
    )
}

export default Navbar