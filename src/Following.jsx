import React, { useEffect, useState } from 'react' 
import axios from 'axios' 
import { useNavigate } from 'react-router-dom' 
 
function Following() { 
  const [following, setFollowing] = useState([]) 
  const navigate = useNavigate() 
 
  useEffect(() => { 
    axios.get(`${import.meta.env.VITE_API_URL}/followers`, { withCredentials: true }) 
      .then(res => setFollowing(res.data)) 
      .catch(err => console.log(err)) 
  }, []) 
 
  const handleUnfollow = (id) => { 
    axios.delete(`${import.meta.env.VITE_API_URL}/followers/${id}`, { withCredentials: true }) 
      .then(() => setFollowing(prev => prev.filter(f => f._id !== id))) 
      .catch(err => console.log(err)) 
  } 
 
  return ( 
    <div className='m-5' style={{ maxWidth: '500px' }}> 
      <div className='d-flex align-items-center mb-4'> 
        <span onClick={() => navigate('/profilepage')} style={{ cursor: 'pointer' }}>←</span> 
        <h5 className='ms-3 mb-0'>Following</h5> 
      </div> 
 
      {following.length > 0 ? ( 
        following.map(f => ( 
          <div className='d-flex align-items-center mb-3' key={f._id}> 
            <img 
              className='rounded-circle' 
              style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
               src={user.profilePic?.startsWith('http') ? user.profilePic :  `${import.meta.env.VITE_API_URL}${user.profilePic}`} 
              alt="pic" 
            /> 
            <b className='ms-3'>{f.username}</b> 
            <button 
              className='btn btn-sm btn-outline-secondary ms-auto' 
              onClick={() => handleUnfollow(f._id)} 
            > 
              Unfollow 
            </button> 
          </div> 
        )) 
      ) : ( 
        <p className='text-muted'>Not following anyone yet</p> 
)} 
</div> 
) 
} 
export default Following