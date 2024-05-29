import { GoogleAuthProvider, getAdditionalUserInfo, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate ,Link} from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

/**
 * @param {string} text 
*/
export const showNotification = (op,text) => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    } else {
      const notyf = new Notyf();
      if(op === "success") notyf.success(text);
      else notyf.error(text);
    }
}


const Login = () => {

    const [err,setErr] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try{
            if(!(email && password)) {
                showNotification("Failed","Email or password missing...");
                return;
            }

            showNotification("success","Try to Log in");

            const result = await signInWithEmailAndPassword(auth,email,password);
            showNotification("success","Welcome Back ! "+result.user.displayName);

            navigate("/");
        }catch(error){
            console.error(error);
            setErr(true);
            showNotification("error","Failed to Log in!\nTry again later plz...");
        }
    };

    const handleSignInWithGoogle = () => {

        const provider = new GoogleAuthProvider(auth);

        signInWithPopup(auth,provider)
        .then(async (result) => {
            // The signed-in user info.
            let user = result.user;
            // create_alert("success","Welcome !",user);
            const { isNewUser } = getAdditionalUserInfo(result);

            if(isNewUser){
                await updateProfile(result.user,{
                    displayName:result.user.displayName,
                    photoURL:user.photoURL,
                });

                await setDoc(doc(db,"users",result.user.uid),{
                    uid:user.uid,
                    displayName:user.displayName,
                    email:user.email,
                    photoURL:user.photoURL,
                });
    
                await setDoc(doc(db,"userChats",user.uid),{});
                showNotification("success","Welcome ! "+user.displayName);
                
            }
            else {showNotification("success","Welcome Back ! "+user.displayName);}
            navigate("/");
        }).catch((error) => {
            // let errorCode = error.code;
            console.error(error.message);
            // create_alert("error",error.message);
            setErr(true);
            showNotification("error","Failed to Log in!\nTry again later plz...");
            // The email of the user's account used.
            // let email = error.customData.email;
            // The AuthCredential type that was used.
            // let credential = GoogleAuthProvider.credentialFromError(error);
        });

    }

    return (
        <div className="FormContainer">
            <div className="FormWrapper">
                <span className="logo">SS ChatRoom</span>
                <span className="title">Login</span>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email"></input>
                    <input type="password" placeholder="Password"></input>
                    <button>Sign In</button>
                    <button type="button" onClick={handleSignInWithGoogle}>Sign In With Google</button>
                </form>
                <p>Don't have an account? <Link to="/register">Register !</Link></p>
            </div>
        </div>
    )
}

export default Login;