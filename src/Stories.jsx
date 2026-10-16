import { useEffect, useState } from 'react' 
import axios from 'axios' 
import './Stories.css' 
 
const API = import.meta.env.VITE_API_URL 
 
const PROFILE_URL = `${API}/profile` 
const SUGGESTION_URL = `${API}/suggestion` 
 
// Keep your real DEFAULT_PIC line here (the long data:image/svg+xml one) 
const DEFAULT_PIC = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64' height='64' fill='%23dbdbdb'/><circle cx='32' cy='24' r='12' fill='%23ffffff'/><path d='M8 64c0-14 10-22 24-22s24 8 24 22z' fill='%23ffffff'/><svg>"; 
 
// Cloudinary: ask for a small square crop centered on the face 
const picSrc = (pic) => { 
  if (!pic) return DEFAULT_PIC 
  if (!pic.startsWith('http')) return `${API}${pic}` 
  if (pic.includes('res.cloudinary.com') && pic.includes('/upload/')) { 
    return pic.replace('/upload/', '/upload/w_200,h_200,c_fill,g_face,f_auto,q_auto/') 
  } 
  return pic 
} 
 
const onPicError = (e) => { 
  e.target.onerror = null 
  e.target.src = DEFAULT_PIC 
} 
 
function Stories() { 
  const [users, setUsers] = useState([]) 
  const [selected, setSelected] = useState(null) 
 
  // Logged-in user + other users from MongoDB (through your backend) 
  useEffect(() => { 
    Promise.allSettled([ 
      axios.get(PROFILE_URL, { withCredentials: true }), 
      axios.get(SUGGESTION_URL, { withCredentials: true }), 
    ]).then(([p, s]) => { 
      const me = p.status === 'fulfilled' ? [p.value.data] : [] 
      const others = 
        s.status === 'fulfilled' && Array.isArray(s.value.data) 
          ? s.value.data 
          : [] 
      const seen = new Set() 
      setUsers( 
        [...me, ...others].filter((u) => { 
          if (!u || !u.username) return false 
          const id = u._id ?? u.username 
          if (seen.has(id)) return false 
          seen.add(id) 
          return true 
        }) 
      ) 
    }) 
  }, []) 
 
  // Popup: Escape closes it, page behind it can't scroll 
  useEffect(() => { 
    if (!selected) return 
    const onKey = (e) => e.key === 'Escape' && setSelected(null) 
    document.addEventListener('keydown', onKey) 
    document.body.style.overflow = 'hidden' 
    return () => { 
      document.removeEventListener('keydown', onKey) 
      document.body.style.overflow = '' 
    } 
  }, [selected]) 
 
  return ( 
    <> 
      <div className="st-row"> 
        {users.map((u) => ( 
          <button 
            key={u._id ?? u.username} 
            type="button" 
            className="st-item" 
            onClick={() => setSelected(u)} 
          > 
            <span className="st-ring"> 
              <img 
                className="st-dp" 
                src={picSrc(u.profilePic)} 
                onError={onPicError} 
                alt="" 
              /> 
            </span> 
            <span className="st-name">{u.username}</span> 
          </button> 
        ))} 
      </div> 
 
      {selected && ( 
        <div className="sv-overlay" onClick={() => setSelected(null)}> 
          <div 
            className="sv-dialog" 
            role="dialog" 
            aria-modal="true" 
            onClick={(e) => e.stopPropagation()} 
          > 
            <div className="sv-header"> 
              <img 
                className="sv-avatar" 
                src={picSrc(selected.profilePic)} 
                onError={onPicError} 
                alt="" 
              /> 
              <span className="sv-username">{selected.username}</span> 
              <button 
                type="button" 
                className="sv-close" 
                onClick={() => setSelected(null)} 
                aria-label="Close" 
              > 
                × 
              </button> 
            </div> 
 
            <div className="sv-body"> 
              <p className="sv-error">Can't load stories</p> 
            </div> 
          </div> 
        </div> 
      )} 
    </> 
  ) 
} 
 
export default Stories
