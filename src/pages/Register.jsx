import React, { useState } from "react";
import add_photo from "../img/add_photo.svg";
import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import {auth,storage,db} from "../firebase";
import { ref,uploadBytesResumable,getDownloadURL } from "firebase/storage";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { showNotification } from "./Login";

const Register = () => {


    const [err,setErr] = useState(false);
    const navigate = useNavigate();
    
    const handleSubmit = async (e) =>{
        e.preventDefault();

        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        var file= e.target[3].files[0];
        console.log(file);

        if(file === undefined) file = null;
        try{
            if(!(displayName && email && password)) {
                showNotification("Failed","DisplayName, email or password missing...");
                return;
            }

            showNotification("success","Registering an account...");

            const usersRef = collection(db, "users");
            const q = query(usersRef, where("displayName", "==", displayName));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                showNotification("failed","Naming Conflict !\nSelect another username plz");
                return;
            }

            const res = await createUserWithEmailAndPassword(auth,email, password);
            console.log(res);

            const storageRef = ref(storage,displayName);
            const uploadTask = uploadBytesResumable(storageRef,file);

            uploadTask.on("state_changed",
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
                (error) =>{
                    // Handle unsuccessful uploads
                    setErr(true);
                },
                () =>{
                    // Handle successful uploads
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) =>{
                        if(file == null) {
                            await updateProfile(res.user,{
                                displayName,
                                photoURL:"https://firebasestorage.googleapis.com/v0/b/ss-cr-2.appspot.com/o/among_us.png?alt=media&token=1c826262-48c8-47c2-afd3-d53bf8a3789c",
                            });
                        }
                        else{
                            await updateProfile(res.user,{
                                displayName,
                                photoURL:downloadURL,
                            });
                        }                    
                        
                        if(file){
                            await setDoc(doc(db,"users",res.user.uid),{
                                uid:res.user.uid,
                                displayName,
                                email,
                                photoURL:downloadURL
                            });
                        }
                        else{
                            await setDoc(doc(db,"users",res.user.uid),{
                                uid:res.user.uid,
                                displayName,
                                email,
                                photoURL:"https://firebasestorage.googleapis.com/v0/b/ss-cr-2.appspot.com/o/among_us.png?alt=media&token=1c826262-48c8-47c2-afd3-d53bf8a3789c",
                            });
                        }

                        await setDoc(doc(db,"userChats",res.user.uid),{});

                        // await setDoc(doc(db,"userhaschatroom",res.user.uid),{});
                        // console.log("File available at",downloadURL);
                        showNotification("success","Welcome ! " + displayName);
                        navigate("/");
                    });
                }
            );

        }catch(error){
            setErr(true);
            showNotification("Failed","Failed to register a new account !\nMaybe you can try another email...");
            console.error(error);
        }
    };

    return (
        <div className="FormContainer">
            <div className="FormWrapper">
                <span className="logo">SS ChatRoom</span>
                <span className="title">Register</span>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="User Name"/>
                    <input type="email" placeholder="Email"/>
                    <input type="password" placeholder="Password"/>
                    <input style={{display:"none"}} type="file" id="file"/>
                    <label htmlFor="file">
                        <img src={add_photo} alt=""></img>
                        <span>Add Profile Picture</span>
                    </label>
                    <button>Sign Up</button>
                    {/* <button onClick={handleSignUpWithGoogle}>Sign Up With Google</button> */}
                    {/* 這裡是Error Alert 可改用lab 6 */}
                    {/* {err && <span>Something went WRONG</span>} */}
                </form>
                <p>Already have an account? <Link to="/login">Login !</Link></p>
            </div>
        </div>
    )
}

export default Register;