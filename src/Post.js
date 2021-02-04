import React, {useState,useEffect}from 'react'
import './Post.css'
// import { Button,Input } from '@material-ui/core';
import { db } from './firebase'
import firebase from 'firebase';
// import Avatar from '@material-ui/core/Avatar';
import Commentr from './comment'
import Recoments from './recomment'

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
           <div className="post__header">
               <img src="avater.png" alt="" className="avater"/>
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
                    comments.map(({id,coment}) =>(
                        <Recoments key={id} user={user} postId = {postId} recommentId = {id} username={coment.username} text={coment.text}/>
                    ))
                }
            </div>

            <Commentr comment={comment} setComment={setComment} handleComment={handleComment}/>
        </div>
    )
}

export default Post
