import { Link } from "react-router-dom"; 
import { useState } from "react"; 
 
function RealPost({ post, onDeleted }) { 
  const [likes, setLikes] = useState(post.likes); 
  const [reposts, setReposts] = useState(post.reposts); 
  const [shares, setShares] = useState(post.shares); 
  const [showMenu, setShowMenu] = useState(false); 
 
  const like = async () => { 
    setLikes((n) => n + 1); 
    await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${post._id}/like`, { 
      method: "POST", 
      credentials: "include" 
    }); 
  }; 
 
  const repost = async () => { 
    setReposts((n) => n + 1); 
    await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${post._id}/repost`, { 
      method: "POST", 
      credentials: "include" 
    }); 
  }; 
 
  const share = async () => { 
    setShares((n) => n + 1); 
    await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${post._id}/share`, { 
      method: "POST", 
      credentials: "include" 
    }); 
  }; 
 
  const deletePost = async () => { 
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${post._id}`, { 
      method: "DELETE", 
      credentials: "include" 
    }); 
    if (res.ok) { 
      onDeleted(post._id); // tells Feed.jsx to remove it from the list 
    } else { 
      alert("Could not delete this post"); 
    } 
    setShowMenu(false); 
  }; 
 
  return ( 
    <div className="my-3" style={{ position: "relative" }}> 
      <div className="d-flex justify-content-between align-items-start"> 
        <div className="d-flex"> 
          <img 
           className="dp rounded-circle" 
              src={profile.profilePic?.startsWith('http') ? profile.profilePic :  `${import.meta.env.VITE_API_URL}${profile.profilePic}`}
             alt="profile pic" 
/>
          <div> 
            <b className="mt-1 ms-2 mb-0">{post.userId.username}</b> 
            <p className="d-block small text-muted mt-0 mb-2 ms-2"> 
              <small>{post.location}</small> 
            </p> 
          </div> 
        </div> 
 
        <div style={{ position: "relative" }}> 
          <i 
            className="bi bi-list" 
            style={{ cursor: "pointer", fontSize: "1.3rem" }} 
            onClick={() => setShowMenu((v) => !v)} 
          ></i> 
 
          {showMenu && ( 
            <div 
              className="bg-white shadow rounded" 
              style={{ 
                position: "absolute", 
                right: 0, 
                top: "1.8rem", 
                zIndex: 10, 
                minWidth: "120px" 
              }} 
            > 
              <div 
                className="p-2 text-danger" 
                style={{ cursor: "pointer" }} 
                onClick={deletePost} 
              > 
                Delete 
              </div> 
            </div> 
          )} 
        </div> 
      </div> 
 
      <img 
        className="image mb-2" 
        src={post.image.startsWith("http") ? post.image : `${import.meta.env.VITE_API_URL}${post.image}`} 
        alt="post" 
      /> 
 
      <div className="d-flex"> 
        <i className="bi bi-heart" onClick={like}></i> 
        <b className="me-2 small text">{likes}</b> 
 
        <Link to={`/post/${post._id}/comments`}> 
          <i className="bi bi-chat"></i> 
        </Link> 
        <b className="me-2 small text">{post.comments.length}</b> 
 
        <i className="bi bi-repeat" onClick={repost}></i> 
        <b className="me-2">{reposts}</b> 
 
        <i className="bi bi-send" onClick={share}></i> 
        <b>{shares}</b> 
      </div> 
 
      <div> 
        <b className="me-2">{post.userId.username}</b>{post.caption} 
        <p className="d-block small text-muted mt-0"> 
          {new Date(post.createdAt).toLocaleString()} 
        </p> 
      </div> 
    </div> 
  ); 
} 
 
export default RealPost;