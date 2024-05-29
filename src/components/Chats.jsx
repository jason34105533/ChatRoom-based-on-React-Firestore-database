import { Timestamp, doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase';
import { ChatContext } from '../context/ChatContext';
import Group_create from "../img/add_circle.svg";
import { v4 as uuid } from "uuid";
import { showNotification } from '../pages/Login';

const Chats = () => {

  const [chats, setChats] = useState([]);


  const { currentUser } = useContext(AuthContext);
  console.log("In useEffect User.uid ", currentUser.uid);
  // const {dispatch} = useContext(ChatContext);
  const { dispatch } = useContext(ChatContext);

  const showNotification_ugly = (text, key) => {
    let notification = new Notification('Notification title', {
      title: "ChatRoom !",
      body: text,
      tag: key,
    });
  }

  // var message_date;
  // let time_stamp = "";


  useEffect(() => {
    // Check if currentUser.uid exists before setting up the listener
    console.log("User.uid ", currentUser.uid);
    if (!currentUser.uid) {
      console.log("OUT");
      return;
    }
    const unsubscribe = onSnapshot(doc(db, "userChats", currentUser.uid), (docucment) => {
        console.log("Current User : ", currentUser.displayName);
        if (docucment.exists()) {
          // console.log(docucment.data());
          setChats(docucment.data());
          console.log(Object.entries(docucment.data()));
          let Arr = Object.entries(docucment.data())?.sort((a, b) => b[1].date - a[1].date);
          // console.log(Arr);
          if (Arr[0]) {
            if (Arr[0][1].lastMessage) console.log(Arr[0][1].lastMessage.displayName + " : " + Arr[0][1].lastMessage.text);
            else return;
            if (Arr[0][1].lastMessage.displayName !== currentUser.displayName) {
              if (Arr[0][1].date.seconds) showNotification_ugly("New Message !", Arr[0][1].date.seconds.toString());
            }
          }
        } else {
          // Handle case where the document doesn't exist
          console.log("User chats document doesn't exist");
        }
      })
    return unsubscribe;
    }, [currentUser]);


const handleSelect = (u) => {
  dispatch({ type: "CHANGE_CHATROOM", payload: u });
}

const handleCreateGroup = async () => {
  console.log("Create New Group ! ");
  let uuid_key = uuid();
  try {
    // create a chat in chats collect
    let p_Arr = [];
    p_Arr.push(setDoc(doc(db, "chats", uuid_key), { messages: [], userids: [currentUser.uid], displayName: [currentUser.displayName] }));

    // create user chats
    p_Arr.push(updateDoc(doc(db, "userChats", currentUser.uid), {
      [uuid_key + ".groupInfo"]: {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        chatRoomId: uuid_key,
      },
      [uuid_key + ".date"]: serverTimestamp()
    }));

    await Promise.all(p_Arr);
    showNotification("success", "Create a new Group !");

  } catch (error) {
    console.error(error);
    showNotification("error", "Failed to create new group...");
  }
  return;
}


return (
  <div className='chats'>
    {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) =>
    (
      <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1].groupInfo)}>
        <img src={chat[1].groupInfo.photoURL} alt="https://firebasestorage.googleapis.com/v0/b/ss-cr-2.appspot.com/o/among_us.png?alt=media&token=1c826262-48c8-47c2-afd3-d53bf8a3789c" />
        <div className='userChatInfo'>
          <span>{"Group:" + chat[1].groupInfo.displayName}</span>
          {
            chat[1].lastMessage && <p>{chat[1].lastMessage?.displayName + " : " + chat[1].lastMessage?.text}</p>
          }
        </div>
      </div>
    )
    )}
    <input type="button" id="Group_create" style={{ display: "none" }} />
    <label htmlFor="Group_create" className="btn Group_create" onDoubleClick={handleCreateGroup}>
      <img src={Group_create} alt="Create Group" id='create_group' style={{ cursor: "pointer", }} />
    </label>
  </div>
)
}

export default Chats