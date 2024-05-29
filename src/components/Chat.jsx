import React, { useContext, useEffect, useState } from 'react'
import Cam from "../img/videocam.svg"
import Group_add from "../img/group_add.svg"
import More from "../img/more.svg"
import Messages from './Messages'
import Input from "./Input"
import { ChatContext } from '../context/ChatContext'
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../firebase'
import { showNotification } from '../pages/Login'

const Chat = () => {
  const { data } = useContext(ChatContext);
  // console.log("What is data",data);
  // console.log("Who u are talking to ",data.user);

  const [userid, setUserid] = useState("");
  // const [user, setUser] = useState(null);

  const handleInvite = async () => {

    if(!userid){
      showNotification("failed","Empty Userid...");
      setUserid("");
      return;
    }
    console.log("Try to invitie", userid);
    showNotification("success","Try to invitie "+userid);
    
    const q = query(collection(db, "users"), where("uid", "==", userid));
    let found = false;

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
        // setUser(doc.data());
        found = true;
      });
    } catch (err) {
      console.error(err);
      console.log("No such User");
      showNotification("error","No such User QQ");
      setUserid("");
      return;
    }

    if (found) {
      try {
        let CR = await getDoc(doc(db, "chats", data.chatId));
        if(CR.data().userids.indexOf(userid) !== -1) {
          showNotification("failed","User already in chatroom... Enjoy chatting!");
          setUserid("");
          return;
        }
        let UR = await getDoc(doc(db, "users", userid));
        let new_room_name = CR.data().displayName +',' + UR.data().displayName;

        let Arr = CR.data().userids;
        let p_Arr = [];

        for(let a of Arr){
          p_Arr.push(updateDoc(doc(db, "userChats", a), {  //更新每個人userChats
            [data.chatId+".groupInfo"]:{
              uid: data.user.uid + "," + userid,
              displayName:new_room_name,
              photoURL: data.user.photoURL,
              chatRoomId: data.chatId,
            }
          }));
        }
        
        await Promise.all(p_Arr);

        p_Arr = [];
        p_Arr.push(updateDoc(doc(db, "chats", data.chatId), {  //更新ChatRoom
          userids: arrayUnion(userid),
          displayName: arrayUnion(UR.data().displayName),
        }));
        // console.log("CR done");

        p_Arr.push(updateDoc(doc(db, "userChats", userid), {  //更新受邀人擁有的chatroomid
          [data.chatId + ".groupInfo"]: {
            uid: data.user.uid + "," + userid,
            displayName: data.user.displayName + "," + UR.data().displayName,
            photoURL: data.user.photoURL,
            chatRoomId: data.chatId,
          },
          [data.chatId + ".date"]: serverTimestamp()
        }));

        await Promise.all(p_Arr);

        console.log("加入完成");
        showNotification("success","Invitation done !\nWelcome our new member: " + UR.data().displayName);

      } catch (err) {
        console.error(err);
        showNotification("error","Invitation failed QQ");
      }
    }
    else{
      showNotification("error","No such User QQ");
    }

    setUserid("");
    // setUser(null);
  };

  const [roomName, setRoomName] = useState("Group")

  useEffect(() => {
    if (data) {
      getDoc(doc(db, "chats", data.chatId)).then((CR) => {
        console.log(CR.data())
        if (CR.data()) {
          setRoomName(_roomName => {
            _roomName = "Group"
            for (let a of CR.data().displayName) {
              _roomName = _roomName + ", " + a;
            }
            return _roomName
          })
        }
      });
    }
  }, [data])




  return (
    <div className="chat">
      <div className="chatInfo">
        <span>
          {roomName}
        </span>
        <div className="chatIcons">
          <input type="text" placeholder='Find a user'
            value={userid}
            onChange={e => setUserid(e.target.value)}
          />
          <img src={Group_add} alt="" onClick={handleInvite} />
          <img src={Cam} alt="" />
          <img src={More} alt="" />
        </div>
      </div>

      {
        (roomName !== "Group")?(<Messages />):(
        <div className="center">
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </div>)
      }
      {/* <Messages /> */}
      <Input />
    </div>
  );
};

export default Chat;