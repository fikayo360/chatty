import React from 'react'
import "./message.css";
import { format } from "timeago.js";

const Message = ({own,message}) => {
  return (
    <div className={own? "message own" : "message"}>
        <div className="messagetop">
            <p className="messagetxt">{message.text}</p>
            <span className="timeago">{format(message.createdAt)}</span>
        </div>
    </div>

  )
}

export default Message