

import React, { useEffect, useState } from 'react' 
import axios from 'axios' 
import { useNavigate } from 'react-router-dom' 
 
function Profilepage() { 
  const [profile, setProfile] = useState(null) 
  const navigate = useNavigate() 
 
  useEffect(() => { 
    axios.get(`${import.meta.env.VITE_API_URL}/profile`, { withCredentials: true }) 
      .then(res => setProfile(res.data)) 
      .catch(err => console.log(err)) 
  }, []) 
 
  if (!profile) return <div className='m-5'>Loading</div> 
 
  return ( 
    <div className='m-5' style={{ maxWidth: '700px' }}> 
      <div className='d-flex align-items-center'> 
        <img 
          className='rounded-circle' 
          style={{ width: '90px', height: '90px', objectFit: 'cover' }} 
               src={profile.profilePic?.startsWith('http') ? profile.profilePic :  `${import.meta.env.VITE_API_URL}${profile.profilePic}`}
          alt="pic" 
        /> 
        <div className='ms-4'> 
          <div className='d-flex align-items-center'> 
            <h5 className='mb-0 me-3'>{profile.username}</h5> 
            <button className='btn btn-sm btn-outline-secondary' onClick={() => 
                 navigate('/profilepage/edit')}> 
              Edit profile 
            </button> 
          </div> 
 
          <div className='d-flex mt-2' style={{ gap: '20px' }}> 
            <span><b>0</b> posts</span> 
            <span><b>{profile.followersCount || 0}</b> followers</span> 
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/profilepage/following')}> <b>{profile.followingCount || 0}</b> following 
</span> 
          </div> 
 
          <div className='mt-2'> 
            {profile.name && <b className='d-block'>{profile.name}</b>} 
            {profile.bio && <p className='mb-1'>{profile.bio}</p>} 
            {profile.website && <a href={profile.website} target="_blank" 
rel="noreferrer">{profile.website}</a>} 
          </div> 
        </div> 
</div> 
<hr className='mt-4' /> 
<p className='text-muted text-center mt-5'>No posts yet</p> 
</div> 
) 
} 
export default Profilepage