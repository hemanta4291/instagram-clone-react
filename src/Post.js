import React, {useState,useEffect}from 'react'
import './Post.css'
// import { Button,Input } from '@material-ui/core';
import { db } from './firebase'
import firebase from 'firebase';
// import Avatar from '@material-ui/core/Avatar';

function Post({user,username,postId,caption,src}) {
    
    const [comments,setComments] = useState([])
    const [comment,setComment] = useState('')

    const handleComment=(e)=>{
        e.preventDefault()
        if(user){
            db.collection("posts").doc(postId).collection("comments").add({
                text:comment,
                username:user.displayName,
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
                setComments(snaphot.docs.map((doc)=>doc.data()))
            })
        }
        return()=>{
            uscribler()
        }
    }, [postId])
    return (
        <div className="post">
           <div className="post__header">
               <img src="/avater.png" alt="" className="avater"/>
                <h3>{username}</h3>
           </div>
           <h4 className="post__text">
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
                    comments.map(({ text,username }) =>(
                    <p className="comments__show"><span className="bold__name">{username}: </span> {text}</p>
                    ))
                }
            </div>

            <div className="add__connents__wrapper">
                <form className="post__form__comment">
                    <input
                        placeholder="add comment"
                        type="text"
                        value={comment}
                        onChange={(e)=>setComment(e.target.value)} 
                    />
                    <button className={"post__comment_btn " +(comment?"pointer":'')} disabled={!comment} onClick={handleComment}>Post</button>
                </form>
            </div>
        </div>
    )
}

export default Post
