import React from 'react'
import "./online.css"

const Online = ({user}) => {
  return (
    <div className="onlinefriendscont">
      { user.profilepic?
       <div className="imgcont">
        <img className="onlinefriendimg" src={user.profilepic} /> 
       <div className="greendot">
       </div>
       </div>
        :
        <div classname="hide" id="picalt"><span id="picalttxt">{user.username.charAt(0).toUpperCase()}</span>
        <div className="greendot">
        </div>
        </div>
        }
   
    <span className="onlinefriendname">{user.username}</span>
 </div>
  )
}

export default Online