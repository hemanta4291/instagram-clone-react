import React,{ useState, useEffect } from 'react';
import './App.css';
import { db,auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import { Button,Input } from '@material-ui/core';
import {ArrowDropDown,ArrowDropUp} from '@material-ui/icons';
import Modal from '@material-ui/core/Modal';
import ProfileUpdate from './profileUpdate'
// import InstagramEmbed from 'react-instagram-embed';
import ImgUpload from './ImgUpload'
// import Avatar from '@material-ui/core/Avatar';


import Post from './Post'



function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const App=() => {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [Inopen, setInOpen] = useState(false);
  const [posts,setPosts] = useState([])
  const [username,setUsername] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [user,setUser] = useState(null)
  const [logToggle,setlogToggle] = useState(false)
  const [PostModal,setPostModal] = useState(false)
  const [ProfModal,setProfModal] = useState(false)

  const handleSignUp = (e)=> {
    e.preventDefault()
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      if(authUser){
        setUsername('')
        setEmail('')
        setPassword('')
      }
      return authUser.user.updateProfile({
          displayName:username
        })
    })
    .catch((error)=>alert(error.message))
      // setOpen(false)
      
  }
  const handleSignIn = (e)=> {
    e.preventDefault()
    auth.signInWithEmailAndPassword (email,password)
    .then((authUser)=>{
        if(authUser){
          setInOpen(false)
          setEmail('')
          setPassword('')
        }
    })
    .catch((error)=>alert(error.message))
    
  }
  useEffect( () =>{
      const unscriber = auth.onAuthStateChanged((authUser)=>{
        if(authUser){
          setUser(authUser)
        }else{
          setUser(null)
        }
      })
      return ()=>{
        unscriber();
      }
  },[user,username])

  useEffect( () =>{
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snaphot =>{
      setPosts(snaphot.docs.map(doc => 
        ({
          id:doc.id,
          post:doc.data()
        })
        ))
    })
  },[])

  

  return (
    <div className="app">
      <Modal
          open={open}
          onClose={() =>setOpen(false)}
        >
         <div style={modalStyle} className={classes.paper}>
         <form>
          <center>
            <h2 id="simple-modal-title">Sign Up</h2>
              <Input
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e)=>setUsername(e.target.value)} 
              />
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)} 
              />
               <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)} 
              />
              <Button onClick={handleSignUp}>Sign Up</Button>
          </center>
          </form>
        </div>
      </Modal>
      <Modal
          open={Inopen}
          onClose={() =>setInOpen(false)}
        >
         <div style={modalStyle} className={classes.paper}>
         <form>
          <center>
            <h2 id="simple-modal-title">Sing In</h2>
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)} 
              />
               <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)} 
              />
              <Button onClick={handleSignIn}>Login</Button>
          </center>
          </form>
        </div>
      </Modal>
      <Modal
          open={PostModal}
          onClose={() =>setPostModal(false)}
        >
         <div style={modalStyle} className={classes.paper}>
          <center>
             {
              user?.displayName?(
                <ImgUpload user = {user} username={user.displayName} setPostModal={setPostModal}/>
              ):(
                <h3><code>!!!</code>you need to login to upload/post</h3>
              )
              
            }
          </center>
        </div>
      </Modal>
      <Modal
          open={ProfModal}
          onClose={() =>setProfModal(false)}
        >
         <div style={modalStyle} className={classes.paper}>
          <center>
             {
              user?.displayName?(
                <ProfileUpdate user={user} username={user.displayName} setPostModal={setPostModal}/>
              ):(
                <h3><code>!!!</code>you need to login to upload/post</h3>
              )
              
            }
          </center>
        </div>
      </Modal>

      <div className="app__header">
        <div className="navbar__left">
          <img 
              className="app__headerImage"
              src="ins.png"
              alt="header-pic"
          />
        </div>
        <div className="nav__center">
          <Button onClick={() => setPostModal(true)}>Add Post</Button>
        </div>
        <div className="navbar__right">
          <div className="user__displayName">
              {
              user?.displayName?(
                <div className="user__profile-avtaer" onClick={()=>setlogToggle(!logToggle)}>
                  <img src={user.photoURL} alt="" className="app__avater"/>
                  <div className="div">
                    <h2>{user.displayName}</h2>
                    {logToggle?(<ArrowDropUp />):(<ArrowDropDown />)}
                    
                  </div>
                </div>
              ):''}
            </div>
            {
              user || username?
              (<div className={"logout__toggle "+ (logToggle?'':'visible')}>
                <ul>
                  <li><Button onClick={() => setProfModal(true)}>Settings</Button></li>
                  <li><Button onClick={() => {auth.signOut(); setlogToggle(false)}}>Logout</Button></li>
                </ul>
                
              </div>)
              :
              (<div className="signIn__signUp">
                <Button onClick={() => setInOpen(true)}>sign in</Button>
                <Button onClick={() => setOpen(true)}>sign up</Button>
              </div>)
              }
      </div>
      </div>
      
      <div className="app__post">
        <center>
          {
            posts.map(({ id,post }) =>(
              <Post key={id} user={user} postId={id} username={post.username} caption={post.caption} src={post.src} profileURL={post.profileURL} />
            ))
          }
        </center>
      </div>

      
    </div>
  );
}

export default App;
