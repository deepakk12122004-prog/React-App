import axios from 'axios' 
import React, { useEffect, useState } from 'react' 
import { useNavigate } from 'react-router-dom'; 

const DEFAULT_PIC = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64' height='64' fill='%23dbdbdb'/><circle cx='32' cy='24' r='12' fill='%23ffffff'/><path d='M8 64c0-14 10-22 24-22s24 8 24 22z' fill='%23ffffff'/><svg>";
function suggestion() { 
  const navigate = useNavigate();
  const [profile, setprofile] = useState(null) 
  const [suggestion, setsuggestion] = useState([]) 
  const [followed, setFollowed] = useState(0) 
 
  useEffect(() => { 
    axios.get(`${import.meta.env.VITE_API_URL}/profile`, { withCredentials: true }) 
      .then(res => setprofile(res.data)) 
      .catch(err => console.log(err)) 
 
    axios.get(`${import.meta.env.VITE_API_URL}/suggestion`, { withCredentials: true }) 
      .then(res => setsuggestion(res.data)) 
      .catch(err => console.log(err)) 
  }, [followed]) 
 
  const handleFollow = async (id) => { 
    axios.post(`${import.meta.env.VITE_API_URL}/followers`, { id }, { withCredentials: true }) 
      .then(() => setFollowed(f => f + 1)) 
      .catch(err => console.log(err)) 
  } 
 
  return ( 
    <div className='pagesuggegtion position-fixed'> 
      <div className='suggestions m-4'> 
        {profile ? ( 
          <div className='d-flex'> 
             <img 
              className='pp rounded-circle mt-1' 
                src={profile.profilePic?.startsWith('http') ? profile.profilePic :  `${import.meta.env.VITE_API_URL}${profile.profilePic}`}
              alt='profilePic' 
            /> 
            <div> 
              <h5 className='me-2 mb-0'>{profile.username}</h5> 
              <p className='d-block small text-muted mt-0 mb-2 '><small>{profile.name}</small></p> 
            </div> 
            <small 
              className='ms-auto text-primary blue' 
              style={{ cursor: 'pointer' }} 
              onClick={() => navigate('/login')} 
             > Switch 
            </small>
          </div> 
        ) : ( 
          <p>Loading</p> 
        )} 
 
        <div className='d-flex'> 
          <p className='text-muted'>Suggested for you</p> 
          <b className='ms-auto'>See All</b> 
        </div> 
 
        {suggestion.length > 0 ? ( 
          <div> 
            {suggestion.map((s) => ( 
              <div className='my-1' key={s._id}> 
                <div className='d-flex'> 
                  <img 
                    className='pp rounded-circle mt-1' 
                     src={s.profilePic?.startsWith('http') ? s.profilePic :  `${import.meta.env.VITE_API_URL}${s.profilePic}`}
                     onError={(e)=>{ e.target.onerror = null; e.target.src= DEFAULT_PIC;}}
                    alt='profilePic' 
                  /> 
                  <div> 
                    <h5 className='me-2 mb-0'>{s.username}</h5> 
                    <p className='d-block small text-muted mt-0 mb-2'>
                          <small>{s.username}</small></p> 
                  </div> 
                  <a className='ms-auto text-primary blue' onClick={() => handleFollow(s._id)}>Follow</a> 
                </div> 
              </div> 
            ))} 
          </div> 
        ) : ( 
          <div>No suggestions</div> 
        )} 
      </div> 
    </div> 
  ) 
} 
 
export default suggestion