import React,{useState} from 'react'
import { db, storage } from './firebase'
import firebase from 'firebase';

const ImgUpload=({username})=> {
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
                        username:username
                    });
                    setProgress(0)
                    setCaption('')
                    setImage(null)
                })
            }
        )
    }
    return (
        <div>
            <h2>Write Post</h2>
            <progress value={progress} max="100" />
            <form>
            <input type="text" onChange={(e)=>setCaption(e.target.value)} value={caption} />
            <input type="file" onChange={handleImage}/>
            <button type="submit" onClick={handleUpload}>Upload</button>
            </form>
        </div>
    )
}

export default ImgUpload;