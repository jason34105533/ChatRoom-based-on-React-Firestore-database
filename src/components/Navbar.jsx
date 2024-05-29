import { signOut } from 'firebase/auth'
import React, { useContext }from 'react'
import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import logout_pic from "../img/logout.svg"
import { showNotification } from '../pages/Login'

const Navbar = () => {
  const {dispatch} = useContext(ChatContext);

  const {currentUser} = useContext(AuthContext);

  function Logout(){
    console.log(currentUser);
    showNotification("success","Log out !");
    dispatch({type:"LOGOUT",payload:null});
    signOut(auth);
  }

  return (
    <div className='navbar'>
      <span className='logo'>SS ChatRoom</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="https://firebasestorage.googleapis.com/v0/b/ss-cr-2.appspot.com/o/among_us.png?alt=media&token=1c826262-48c8-47c2-afd3-d53bf8a3789c"/>
        <span>{currentUser.displayName}</span>
        {/* <button onClick={Logout}>Logout</button> */}
        <input type='button' onClick={Logout} style={{display:"none"}} id="logout"/>
        <label htmlFor='logout' className='logout_btn'>
          <img src={logout_pic} alt='logout' style={{backgroundColor:"transparent"}}/>
        </label>
      </div>
    </div>
  )
}

export default Navbar