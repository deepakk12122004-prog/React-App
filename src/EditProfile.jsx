import React, { useEffect, useState, useRef } from 'react' 
import axios from 'axios' 
import { useNavigate } from 'react-router-dom' 
 
function EditProfile() { 
  const [form, setForm] = useState({ name: "", username: "", website: "", bio: "" }) 
  const [profilePic, setProfilePic] = useState("") 
  const fileInputRef = useRef(null) 
  const navigate = useNavigate() 
 
  useEffect(() => { 
    axios.get(`${import.meta.env.VITE_API_URL}/profile`, { withCredentials: true }) 
      .then(res => { 
        setForm({
          name: res.data.name || "", 
          username: res.data.username || "", 
          website: res.data.website || "", 
          bio: res.data.bio || "" 
        }) 
        setProfilePic(res.data.profilePic || "") 
      }) 
      .catch(err => console.log(err)) 
  }, []) 
 
  const handleChange = (e) => { 
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value })) 
  } 
 
  const handlePicChange = async (e) => { 
    const file = e.target.files[0] 
    if (!file) return 
    const formData = new FormData() 
    formData.append('image', file) 
    axios.post(`${import.meta.env.VITE_API_URL}/profile/picture`, formData, { withCredentials: true }) 
      .then(res => setProfilePic(res.data.profilePic)) 
      .catch(err => console.log(err)) 
  } 
 
  const handleSave = async () => { 
    axios.put(`${import.meta.env.VITE_API_URL}/profile`, form, { withCredentials: true }) 
      .then(() => navigate('/profilepage')) 
      .catch(err => console.log(err)) 
  } 
 
  return ( 
    <div className='m-5' style={{ maxWidth: '500px' }}> 
      <div className='d-flex align-items-center mb-4'> 
        <img 
          className='rounded-circle' 
          style={{ width: '60px', height: '60px', objectFit: 'cover' }} 
           src={user.profilePic?.startsWith('http') ? user.profilePic :  `${import.meta.env.VITE_API_URL}${user.profilePic}`}
          alt="pic" 
        /> 
        <div className='ms-3'> 
          <b className='d-block'>{form.username}</b> 
          <a 
            className='text-primary' 
            style={{ cursor: 'pointer', fontSize: '0.9rem' }} 
            onClick={() => fileInputRef.current.click()} 
          > 
            Change Profile Photo 
          </a> 
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePicChange} 
hidden /> 
        </div> 
      </div> 
 
      <div className='mb-3'> 
        <label className='fw-bold small'>Name</label> 
        <input className='form-control' name='name' value={form.name} 
onChange={handleChange} /> 
      </div> 
 
      <div className='mb-3'> 
        <label className='fw-bold small'>Username</label> 
        <input className='form-control' name='username' value={form.username} 
onChange={handleChange} /> 
      </div> 
 
      <div className='mb-3'> 
        <label className='fw-bold small'>Website</label> 
        <input className='form-control' name='website' placeholder='Website' 
value={form.website} onChange={handleChange} /> 
      </div> 
 
      <div className='mb-4'> 
        <label className='fw-bold small'>Bio</label> 
        <textarea className='form-control' name='bio' rows={4} value={form.bio} 
onChange={handleChange} /> 
      </div> 
 
      <div className='d-flex gap-2'> 
        <button className='btn btn-primary' onClick={handleSave}>Submit</button> 
        <button className='btn btn-outline-secondary' onClick={() => 
navigate('/profilepage')}>Cancel</button> 
      </div> 
</div> 
) 
} 
export default EditProfile