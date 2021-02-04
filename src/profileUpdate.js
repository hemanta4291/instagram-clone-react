import React,{useState} from 'react'
import { storage } from './firebase'
import { Button,Input } from '@material-ui/core';
// import firebase from 'firebase';
import './imgUpload.css'

const ProfileUpdate=({user,username,setPostModal})=> {
    const [image,setImage] = useState(null)
    const [progress,setProgress] = useState(0)
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
                    return user.updateProfile({
                        photoURL:url
                      })
                })
            }
        )
    }
    return (
        <div className="add__post__wrapper">
            <h2>Profile Update</h2>
            <progress className="prograss__wrapper" value={progress} max="100" />
            <form className="post__form">
               <Input
                placeholder="upload images"
                type="file"
                onChange={handleImage} 
              />
                <Button onClick={handleUpload}>Update!</Button>
            </form>
        </div>
    )
}

export default ProfileUpdate;