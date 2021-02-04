import React, {useState,useEffect}from 'react'
// import { Button,Input } from '@material-ui/core';
import { db } from './firebase'
import firebase from 'firebase';
import './recomment.css'
import Commentr from './comment'

const Recoments = ({profileURL,recommentId,user,postId,username,text})=>{

    const [recomments, setRecomments] = useState([])
    const [recomment, setreComment] = useState([])
    const [retoggle, setretoggle] = useState(false)
    
    const handlereComment=(e)=>{
        e.preventDefault()
        //console.log(user)
        if(user){
            db.collection("posts").doc(postId).collection("comments").doc(recommentId).collection("recomments").add({
                text:recomment,
                username:user.displayName,
                profileURL:user.photoURL,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            setreComment('')
            setretoggle(false)
        }else{
            alert("? You need to login to comment")
            setreComment('')
            setretoggle(false)
        }
    }

    useEffect(() => {
        let uscribler;
        if(recommentId){
            uscribler= db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .doc(recommentId)
            .collection("recomments")
            .orderBy('timestamp','asc')
            .onSnapshot((snaphot)=>{
                setRecomments(snaphot.docs.map((doc)=>
                ({
                    id:doc.id,
                    recoment:doc.data()
                  })
                ))
            })
        }
        return()=>{
            uscribler()
        }
    }, [postId,recommentId])


    return(
        <>
                <div className="first__comments">
                   <div className="first__comments_li">
                   <img src={profileURL} alt=""/>
                    <p className="comments__show" onClick={()=>console.log(profileURL)}><span className="bold__name">{username} : </span>{text}</p>
                    <div className="replay_comment_btn"><span onClick={()=>setretoggle(!retoggle)}>Repaly</span></div>
                   </div>
                     
                     <div className={"replay__toggle "+(retoggle?'':'nodisplay')}>
                        <Commentr comment={recomment} setComment={setreComment} handleComment={handlereComment}/>
                     </div>
                </div>
               
                {
                    recomments.map(({id,recoment}) =>(
                        <div className="replay__comment" key={id}>
                        <img src={recoment.profileURL} alt=""/>
                        <p className="comments__show" onClick={()=>console.log(recommentId)}><span className="bold__name">{recoment.username} : </span>{recoment.text}</p>
                        <div className="replay_comment_btn"><span onClick={()=>setretoggle(!retoggle)}>Repaly</span></div>
                        </div>
                    ))
                 }
               
        </>
    )
}

export default Recoments
