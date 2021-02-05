import React, {useState,useEffect}from 'react'
import './Post.css'
// import { Button,Input } from '@material-ui/core';
import { db } from './firebase'
import firebase from 'firebase';
// import Avatar from '@material-ui/core/Avatar';
import Commentr from './comment'
import Recoments from './recomment'
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
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
  

const Post=({user,username,profileURL,postId,caption,src,email,uid}) => {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [comments,setComments] = useState([])
    const [comment,setComment] = useState('')
    const [guserModal,setguserModal] = useState(false)
    const [indPost,setindPost] = useState([])

    useEffect( () =>{
        db.collection('posts').orderBy('timestamp','desc').onSnapshot(snaphot =>{
            setindPost(snaphot.docs.map(doc => 
            (doc.data())
            ))
        })
      },[])

    const handleComment=(e)=>{
        e.preventDefault()
        if(user){
            db.collection("posts").doc(postId).collection("comments").add({
                text:comment,
                username:user.displayName,
                profileURL:user.photoURL,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            setComment('')
        }else{
            alert("? You need to login to comment")
            setComment('')
        }
    }
    useEffect(() => {
        let uscribler;
        if(postId){
            uscribler= db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp','desc')
            .onSnapshot((snaphot)=>{
                setComments(snaphot.docs.map((doc)=>
                ({
                    id:doc.id,
                    coment:doc.data()
                  })
                ))
            })
        }
        return()=>{
            uscribler()
        }
    }, [postId])

    return (
        <div className="post">
           <div className="post__header" >
               {/* <img src="avater.png" alt="" className="avater"/> */}
               <img src={profileURL} alt="" className="avater"/>
                <h3 onClick={()=>setguserModal(true)}>{username}</h3>
           </div>
           <h4 className="post__text" onClick={()=>console.log(indPost,uid)}>
                <strong> Title: </strong>
                {caption}
            </h4>
            <img 
                className="post__image"
                src={src}
                alt="post-pic"
            />
            <h4 className="comment__box">
                Comments bellow
            </h4>
           
            <div className="comments__wrapper">
                {
                    comments.map(({id,coment}) =>(
                        <Recoments key={id} profileURL={coment.profileURL} user={user} postId = {postId} recommentId = {id} username={coment.username} text={coment.text}/>
                    ))
                }
            </div>

            <Commentr profileURL={profileURL} comment={comment} setComment={setComment} handleComment={handleComment}/>
        
            <Modal
                open={guserModal}
                onClose={() =>setguserModal(false)}
                className="user__profile__modal">
                <div style={modalStyle} className={classes.paper}>
                <div className="post__headerr" >
                    {/* <img src="avater.png" alt="" className="avater"/> */}
                    <img src={profileURL} alt="" className="avaterr"/>
                    <div className="contents__modal">
                        <h3 className="post__textt"><strong> Username: </strong>{username} </h3>
                        {/* <h3 className="post__textt"><strong> Title: </strong>{caption} </h3> */}
                        <h3 className="post__textt"><strong> Email: </strong>{email}</h3>
                        <h3 className="post__textt"><strong> Uid: </strong>{uid}</h3>
                        
                    </div>
                </div>
                <div className="induser__post">
                    {
                        indPost.map((post,i) =>(
                            post.uid === uid ?
                            <div className="ddd__ddd" key={i}>

                                <img src={post.src} alt="" className="avaterr"/>
                                {post.title}
                                {post.caption}
                            </div>
                            :''
                        ))
                    }
                </div>
                </div>
            </Modal>
        
        </div>
    )
}

export default Post
