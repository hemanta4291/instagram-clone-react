import React from 'react'

const comment=({comment,setComment,handleComment})=> {
    return (
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
    )
}

export default comment
