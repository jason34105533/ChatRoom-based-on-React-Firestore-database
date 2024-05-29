import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Message = ({message}) => {

  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);

  const ref = useRef()

  useEffect(() => {
    ref.current?.scrollIntoView({behavior:"smooth"})
  },[message]);

  let message_date = new Date(message.date.seconds * 1000);

  let dataValues = [
    message_date.getFullYear(),
    message_date.getMonth() + 1,
    message_date.getDate(),
    message_date.getHours(),
    message_date.getMinutes(),
    message_date.getSeconds(),
  ];

  // console.log("dataValue",dataValues);
  let time_stamp = "";
  for(let a=1;a<5;a++){
    if(a==1) time_stamp+=(dataValues[a]+'/');
    else if(a==2) time_stamp+=(dataValues[a]+' ');
    else if(a==3) time_stamp+=((dataValues[a]<10?"0":"")+dataValues[a]+':');
    else time_stamp+=((dataValues[a]<10?"0":"")+dataValues[a]);
  }

  /**
   * 
   * @param {String} string 
   * @returns {Boolean} 
   */
  function isValidUrl(string) {
    if (string && string.length > 1 && string.slice(0, 2) == '//') {
        string = 'http:' + string; //dummy protocol so that URL works
    }
    try {
        var url = new URL(string);
        return url.hostname && url.hostname.match(/^([a-z0-9])(([a-z0-9-]{1,61})?[a-z0-9]{1})?(\.[a-z0-9](([a-z0-9-]{1,61})?[a-z0-9]{1})?)?(\.[a-zA-Z]{2,4})+$/) ? true : false;
    } catch (_) {
        return false;
    }
  }

  let isURL = isValidUrl(message.text);
  

  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && "owner"}`}>
      <div className="messageInfo">
        <img 
          src={message.senderphotoURL}  //data.user.photourl得改 
          alt="" 
        />
        <span>{time_stamp}</span>
        {/* <span>{message.date}</span> */}
      </div>

      <div className="messageContent">
        {
          (isURL)?<p><a href={message.text} target='_blank' rel="noopener noreferrer">{message.text}</a></p>:<p>{message.text}</p>
        }
        {message.img &&<img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;