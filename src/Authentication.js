import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Post from "./Post/Post";
import { db } from "./firebase";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Input } from '@material-ui/core'
import { auth } from "firebase";
import ImageUpload from './ImageUpload'
import InstagramEmbed from 'react-instagram-embed';
import { FaSignInAlt } from 'react-icons/fa';
import { Modal } from 'react-bootstrap';
import { FiCamera } from 'react-icons/fi'
import {BiLogInCircle} from 'react-icons/bi';
import {VscSignIn} from "react-icons/vsc"



function Authen() {
 
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [openSignIn, setOpenSignIn] = useState(false)
  const handleCloseIn = () => setOpenSignIn(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  // IMAGE UPLOAD 
  const [showimage, setShowImage] = useState(false);

  const handleCloseImage = () => setShowImage(false);
  const handleShowImage = () => setShowImage(true);







  const signUp = (e) => {
    e.preventDefault();

    auth().createUserWithEmailAndPassword(email, password)
      .then((authUser) => (authUser.user.updateProfile({
        displayName: username
      })))
      .catch((error) => alert(error.message))
      .then(handleClose)
      .catch((error) => console.log(error))

  }


  const signIn = (e) => {
    e.preventDefault();

    auth().signInWithEmailAndPassword(email, password)
      
      .catch((error) => alert(error.message))
      .then(handleCloseIn)
      .catch((error) => console.log(error))

  }

  useEffect(() => {

    const unsubscribe = auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        //User logged in ....
        console.log(authUser);
        setUser(authUser);

      }
      else {
        //User is logged out ....
        setUser(null);
      }
    })
    return () => {
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    //this where the code runs 
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      //every time new post upload this code rus
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })
      ));

    })     //it is collection in firebase named 'posts;    //snapshot runs every time when when a document CRUD 
  }, []);



  return (
    <div className="authentication">





      <Modal
        show={showimage}
        // onClose={() => setShow(false)}
        onHide={handleCloseImage}
        backdrop="static"
        keyboard={false}

      >
       {user?.displayName ? (
        <ImageUpload username={user.displayName} />

      ) : (<h3> sorry, LogIn to upload </h3>)}
          <Button onClick={handleCloseImage}>
          Close
          </Button>

      </Modal>

     
      <Modal
        show={show}
        
        onHide={handleClose}
        backdrop="static"
        keyboard={false}

      >
        <form className="app_signup">

          <center>
            <img
              className="app_headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
            />
          </center>
          <Input
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" onClick={(signUp)}> SignUp </Button>
        </form>

      
        <Button onClick={handleClose}> Close </Button>


      </Modal>

      <Modal
        show={openSignIn}
       
        onHide={handleClose}
        backdrop="static"
        keyboard={false}

      >
        <form className="app_signup">

          <center>
            <img
              className="app_headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
            />
          </center>
        
          <Input
            placeholder="Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
         
          <Button type="submit" onClick={(signIn)}> SignIn </Button>
        </form>
       
        <Button onClick={handleCloseIn}> Close </Button>


      </Modal>


      <div className="app_header">
       
        <FiCamera className = "camera" size="20px"
          onClick={handleShowImage}
        />
        <img
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        />


       
        {user ? (<FaSignInAlt  size= "18px" className="react-icons" onClick={() => auth().signOut()} />)
          : (
            <div className="app_loginContainer">
              <BiLogInCircle size = "18px" className="react-login" onClick={() => setOpenSignIn(true)}/>
              <VscSignIn size = "18px" className="react-signup" onClick={() => setShow(true)}/> 
            </div>
          )
        }
      </div>
      

      <div className="app_posts">

        {posts.map(({ id, post }) => (
          <Post
            key={id}
            postId={id}
            user={user} //user is comment user
            username={post.username.toLowerCase()}
            caption={post.caption}
            imageUrl={post.imageUrl}
          />
        ))}
      </div>

      <div className ="initals">Coded by garvit</div>

     
    </div>

    //</div>
  )
}


export default Authen;