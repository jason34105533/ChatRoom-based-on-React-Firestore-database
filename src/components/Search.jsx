import React, { useContext, useState } from 'react';
import {collection,doc,getDoc,getDocs,query,serverTimestamp,setDoc,updateDoc,where} from "firebase/firestore";
import {db} from "../firebase";
import {AuthContext} from "../context/AuthContext"
import {v4 as uuid} from "uuid";
import { showNotification } from '../pages/Login';

const Search = () => {

  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const {currentUser} = useContext(AuthContext);

  const handleSearch = async () => {
    // console.log("Current User",currentUser.displayName);
    console.log("Looking for",username);
    const q = query(collection(db,"users"),where("displayName","==",username));

    try{
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
        setUser(doc.data());
      });
    }catch(err){
      console.error(err);
      setErr(true);
    }
  };

  const handleKey = (e) =>{  //讓他收得回去(在input = ""，按下enter時會收回去原本展出來的東西)
    // (e.code === "Enter" ) && handleSearch();
    if(e.code === "Enter"){
      if(username)handleSearch();
      else setUser(null);
    }
  };

  const handlecopyuidOnclick = () => {
    document.execCommand("copy");
  }

  const handlecopyuid = (e) => {
    console.log("copyid!!");
    e.preventDefault();
    if (e.clipboardData) {
      e.clipboardData.setData("text/plain",user.uid);
      // console.log(e.clipboardData.getData("text"));
      showNotification("success","User uid copied");
    }
  };

  const handleSelect = async() =>{
    //check whether the group exist or not, if not create one.
    const comnbinedId = (currentUser.uid > user.uid)? (currentUser.uid + user.uid):(user.uid + currentUser.uid);
    let uuid_key = uuid();

    if(user.uid !== currentUser.uid){
      try{
        const  res = await getDoc(doc(db,"chats",comnbinedId));  //現在是廢句子了(因為用uuid()做key)
        

        if(!res.exists()){  //if not exist
          // create a chat in chats collect
          await setDoc(doc(db,"chats",uuid_key),{messages:[],userids:[user.uid,currentUser.uid],displayName:[user.displayName,currentUser.displayName]});

          // create user chats
          await updateDoc(doc(db,"userChats",currentUser.uid),{
            [uuid_key+".groupInfo"]:{
              uid:user.uid + "," + currentUser.uid,
              displayName:user.displayName + "," + currentUser.displayName,
              photoURL: user.photoURL,
              chatRoomId:uuid_key,
            },
            [uuid_key+".date"]:serverTimestamp()
          });

          await updateDoc(doc(db,"userChats",user.uid),{
            [uuid_key+".groupInfo"]:{
              uid:user.uid + "," + currentUser.uid,
              displayName:user.displayName + "," + currentUser.displayName,
              photoURL: currentUser.photoURL,
              chatRoomId:uuid_key,
            },
            [uuid_key+".date"]:serverTimestamp()
          });
  ;     }
      }catch(error){
        console.error(error);
      }
    }
    // create user chats
    setUser(null);
    setUsername("");
  };

  return (
    <div className='search'>
      <div className='searchForm'>
        <input type="text" placeholder='Find a user' 
          onKeyDown={handleKey} 
          onChange={e=>setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User Not Found</span>}
      {user && <div className="userChat" onDoubleClick={handleSelect} onCopy={handlecopyuid} onClick={handlecopyuidOnclick}>
        <img src={user.photoURL} alt="" />
        <div className='userChatInfo'>
          <span>{user.displayName}</span>
          <div>{user.uid}</div>
        </div>
      </div>}
    </div>
  )
}

export default Search