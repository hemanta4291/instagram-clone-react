import React from 'react'
import './Post.css'
// import Avatar from '@material-ui/core/Avatar';

function Post({username,caption,src}) {
    return (
        <div className="post">
           <div className="post__header">
               <img src="/avater.png" alt="" className="avater"/>
                <h3>{username}</h3>
           </div>
            <img 
                className="post__image"
                src={src}
                alt="post-pic"
            />

            <h4 className="post__text">
                <strong>{username} : </strong>
                {caption}
            </h4>
        </div>
    )
}

export default Post
