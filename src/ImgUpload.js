import React,{useState} from 'react'
import { db, storage } from './firebase'
import { Button,Input } from '@material-ui/core';
import firebase from 'firebase';
import './imgUpload.css'

const ImgUpload=({noti,setNoti,user,username,setPostModal})=> {
    const [image,setImage] = useState(null)
    const [progress,setProgress] = useState(0)
    const [caption,setCaption] = useState('')
    const handleImage=(e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    }
    const handleUpload=(e)=>{
        e.preventDefault()
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        uploadTask.on(
            "state_changed",
            (snapshot)=>{
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) *100
                );
                setProgress(progress)
            },
            (error)=>{
                alert(error.message)
            },
            ()=>{
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url=>{
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption:caption,
                        src:url,
                        username:username,
                        profileURL:user.photoURL,
                        email:user.email,
                        uid:user.uid
                    });
                    setProgress(0)
                    setCaption('')
                    setImage(null)
                    setPostModal(false)
                    window.scrollTo(0, 0);
                    if(url){
                        setNoti(noti+1)
                    }
                })
            }
        )
    }
    return (
        <div className="add__post__wrapper">
            <h2>Write Post</h2>
            <progress className="prograss__wrapper" value={progress} max="100" />
            <form className="post__form">
                <Input
                    placeholder="Caption"
                    type="text"
                    value={caption}
                    onChange={(e)=>setCaption(e.target.value)} 
                />
               <Input
                placeholder="upload images"
                type="file"
                onChange={handleImage} 
              />
                <Button onClick={handleUpload}>Post Publish!</Button>
            </form>
        </div>
    )
}

export default ImgUpload;