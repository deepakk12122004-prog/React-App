import axios from 'axios' 
import React, { useEffect, useState } from 'react' 
 
function suggestion() { 
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
                src={user.profilePic?.startsWith('http') ? user.profilePic :  `${import.meta.env.VITE_API_URL}${user.profilePic}`}
              alt='profilePic' 
            /> 
            <div> 
              <h5 className='me-2 mb-0'>{profile.username}</h5> 
              <p className='d-block small text-muted mt-0 mb-2 '><small>{profile.name}</small></p> 
            </div> 
            <small className='ms-auto text-primary blue'>Switch</small> 
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
                     src={user.profilePic?.startsWith('http') ? user.profilePic :  `${import.meta.env.VITE_API_URL}${user.profilePic}`}
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