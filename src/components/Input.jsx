import React, { useContext, useState } from 'react'
import add_photo from "../img/add_photo.svg"
import attach_file from "../img/attach_file.svg"
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { Timestamp, arrayUnion, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import {v4 as uuid} from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import send_text from "../img/send.svg";

const Input = () => {
  const [text,setText] = useState("");
  const [img,setImg] = useState(null);

  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);

  const handleSend = async () =>{

    console.log("You are in ChatRoom:",data.chatId);
    if(data.chatId == "null" || !(text || img)){
      console.log("I'm fine");
      setText("");
      setImg(null);
      return;
    }

    if(img){

      const storageRef = ref(storage,uuid());
      const uploadTask = uploadBytesResumable(storageRef,img);

      uploadTask.on("state_changed",  //Paste from Firebase Document
        (snapshot) =>{
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) *100;
          console.log("Upload is" + progress + "% done");
          switch (snapshot.state){
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break; 
            default:
              console.log("idk about ur upload img");
              break; 
          }
        },
        (error) => {
          // setErr(true);
        },
        () =>{
            // Handle successful uploads
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) =>{
            await updateDoc(doc(db,"chats",data.chatId),{
              messages:arrayUnion({  //firebase methood for firestore
                id: uuid(),
                senderId:currentUser.uid,
                text:(text?text:"(Send a pic)"),
                senderphotoURL:currentUser.photoURL,
                date:Timestamp.now(),
                img:downloadURL,
              })
            });
          });
        }
      );

    }
    else{
      await updateDoc(doc(db,"chats",data.chatId),{
        messages:arrayUnion({
          id: uuid(),
          text,
          senderId:currentUser.uid,
          senderphotoURL:currentUser.photoURL,
          date:Timestamp.now(),
        })
      });
    }

    // console.log("I'm fine");

    let CR = await getDoc(doc(db, "chats", data.chatId));
    let Arr = CR.data().userids;
    let p_Arr = [];
    
    for(let a of Arr){
      p_Arr.push(updateDoc(doc(db, "userChats", a), {  //更新每個人userChats
        [data.chatId + ".lastMessage"]:{
          text:text?text:"(Send a pic)",
          displayName:currentUser.displayName,
        },
        [data.chatId+".date"]: serverTimestamp(),        
      }));
    }

    await Promise.all(p_Arr);

    setText("");
    setImg(null);
  };
  
  return (
    <div className='input'>
      <input type='text' placeholder='Your message...' 
        onChange={(e) => setText(e.target.value)}
        value={text}
        // maxLength="50"
      />
      <div className="send">
        <img src={attach_file} alt=''/>
        <input type='file' style={{display:"none"}} id="file" onChange={(e) => setImg(e.target.files[0])}/>
        <label htmlFor='file'>
          <img src={add_photo} alt=''/>
        </label>
        <input type='button' onClick={handleSend} style={{display:"none"}} id="send"/>
        <label htmlFor='send' >
          <img src={send_text} alt='Send'/>
        </label>
      </div>
    </div>
  )
}

export default Input