// server.js 
const express = require('express'); 
const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt'); 
const session = require('express-session'); 
const cors = require('cors');
const multer = require('multer'); 
const path = require('path');  
require('dotenv').config();

const cloudinary = require('cloudinary').v2; 
const { CloudinaryStorage } = require('multer-storage-cloudinary'); 
cloudinary.config({ 
cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
api_key: process.env.CLOUDINARY_API_KEY, 
api_secret: process.env.CLOUDINARY_API_SECRET, 
});

const fs = require('fs');
fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true })
 
const app = express();
app.set('trust proxy', 1);  
 
// ---------- Middleware ---------- 
app.use(express.json()); 
app.use(cors({ 
  origin: process.env.CLIENT_URL || 'http://localhost:5173',  
  credentials: true 
})); 
app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: false, 
  cookie: { 
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 1000 * 60 * 60 * 24, // 1 day 
  } 
})); 
 
// ---------- Database ----------  
mongoose.connect(process.env.MONGO_URI) 
  .then(() => console.log("MongoDB Atlas connected")) 
  .catch(err => console.log(err));

//--------- Serve uploads + posts routes -----------
app.use("/uploads", express.static("uploads"));
app.use("/api/posts", require("./routes/posts"));
 
// ---------- User Model ---------- 
const userSchema = new mongoose.Schema({ 
username: String, 
name: { type: String, default: "" }, 
email: { type: String, unique: true }, 
password: String, 
profilePic: { type: String, default: "" }, 
website: { type: String, default: "" }, 
bio: { type: String, default: "" }, 
following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
role: { type: String, default: 'user' } 
}); 
const User = mongoose.model('User', userSchema);
 
// ---------- Auth Middleware ---------- 
function requireAuth(req, res, next) { 
  if (req.session.userId) return next(); 
  res.status(401).json({ message: 'Not logged in' }); 
} 
 
async function requireAdmin(req, res, next) { 
  const user = await User.findById(req.session.userId); 
    if (user && user.role === 'admin') return next(); 
  res.status(403).json({ message: 'Forbidden' }); 
} 
 
// ---------- Routes ---------- 
 
// Register 
app.post('/register', async (req, res) => { 
  try { 
    const { username, email, password } = req.body; 
    const existing = await User.findOne({ email }); 
    if (existing) return res.status(400).json({ message: 'Email already registered' }); 
 
    const hashed = await bcrypt.hash(password, 10); 
    const user = await User.create({ username, email, password: hashed });
    
    req.session.userId = user._Id;
    res.json({ message: 'Registered successfully', user:{username: user.username, email: user.email}}); 
  } catch (err) { 
    res.status(500).json({ message: 'Server error', error: err.message }); 
  } 
}); 
 
// Login 
app.post('/login', async (req, res) => { 
  try { 
    const { email, password } = req.body; 
    const user = await User.findOne({ email }); 
    if (!user) return res.status(401).json({ message: 'Invalid credentials' }); 
 
    const match = await bcrypt.compare(password, user.password); 
    if (!match) return res.status(401).json({ message: 'Invalid credentials' }); 
 
    req.session.userId = user._id; 
    res.json({ message: 'Logged in', user: { username: user.username, email: user.email } }); 
  } catch (err) { 
    console.log('LOGIN ERROR:', err)
    res.status(500).json({ message: 'Server error', error: err.message }); 
  } 
}); 
 
// Logout 
app.post('/logout', (req, res) => { 
  req.session.destroy(() => { 
    res.clearCookie('connect.sid'); 
    res.json({ message: 'Logged out' }); 
  }); 
}); 
 
// Protected route (any logged-in user) 
// app.get('/profile', requireAuth, async (req, res) => { 
//     const user = await User.findById(req.session.userId).select('-password'); 
// res.json(user); 
// }); 

  app.get('/profile', requireAuth, async (req, res) => { 
  const user = await User.findById(req.session.userId).select('-password'); 
  const followingCount = user.following.length; 
  const followersCount = await User.countDocuments({ following: user._id }); 
  res.json({ ...user.toObject(), followingCount, followersCount }); 
});

// Update profile 
app.put('/profile', requireAuth, async (req, res) => { 
  const user = await User.findByIdAndUpdate( 
    req.session.userId, 
    { 
      username: req.body.username, 
      name: req.body.name, 
      website: req.body.website, 
      bio: req.body.bio 
    }, 
    { new: true } 
  ).select('-password'); 
  res.json(user); 
}); 

const profileStorage = new CloudinaryStorage({ 
   cloudinary, 
    params: { 
    folder: 'instagram-clone/profiles', 
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], 
}, 
}); 
const uploadProfile = multer({ storage: profileStorage }); 
 
app.post('/profile/picture', requireAuth, uploadProfile.single('image'), async (req, res) => { 
  try { 
    const user = await User.findByIdAndUpdate( 
      req.session.userId, 
      { profilePic: req.file.path },  
      { new: true } 
    ).select('-password'); 
    res.json(user); 
  } catch (err) { 
    console.log('PROFILE PIC ERROR:', err); 
    res.status(500).json({ message: 'Server error', error: err.message }); 
  } 
});
 
// Get who I'm following 
app.get('/followers', requireAuth, async (req, res) => { 
  const user = await User.findById(req.session.userId).populate('following', 'username profilePic'); 
  res.json(user.following); 
}); 
 
// Follow someone 
app.post('/followers', requireAuth, async (req, res) => { 
  const user = await User.findById(req.session.userId); 
  if (!user.following.includes(req.body.id)) { 
    user.following.push(req.body.id); 
    await user.save(); 
  } 
  res.json({ message: 'followed' }); 
}); 
 
// Unfollow someone 
app.delete('/followers/:id', requireAuth, async (req, res) => { 
  const user = await User.findById(req.session.userId); 
  user.following = user.following.filter(fid => fid.toString() !== req.params.id); 
  await user.save(); 
  res.json({ message: 'unfollowed' }); 
}); 
 
// Suggested users 
app.get('/suggestion', requireAuth, async (req, res) => { 
  const me = await User.findById(req.session.userId); 
  const suggestions = await User.find({ 
    _id: { $nin: [...me.following, me._id] } 
  }).select('username profilePic'); 
  res.json(suggestions); 
});

// Protected + role-restricted route 
app.get('/admin', requireAuth, requireAdmin, (req, res) => { 
res.json({ message: 'Welcome admin' }); 
}); 
// ---------- Start Server ---------- 
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

