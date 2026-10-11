const express = require("express"); 
const multer = require("multer"); 
const path = require("path"); 
const Post = require("../models/post"); 
const router = express.Router();
const cloudinary = require("cloudinary").v2; 
const { CloudinaryStorage } = require("multer-storage-cloudinary"); 
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET, 
});
 
const storage = new CloudinaryStorage({ 
  cloudinary, 
  params: { 
    folder: "instagram-clone", 
    allowed_formats: ["jpg", "jpeg", "png", "webp"], 
  }, 
 }); 
 const upload = multer({storage});
 
router.post("/", upload.single("image"), async (req, res) => { 
  console.log("POST /api/post route was hit");
  console.log("Session at post time:", req.session);
   try { 
    const post = await Post.create({ 
      userId: req.session.userId, 
      image: req.file.path, 
      caption: req.body.caption, 
      location: req.body.location
    }); 
    res.status(201).json(post); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  } 
}); 
 

 
router.get("/", async (req, res) => { 
  const posts = await Post.find().populate("userId", "username profilePic name").sort({ createdAt: -1 }); 
  res.json(posts); 
}); 
 
 
router.get("/:id", async (req, res) => { 
  const post = await Post.findById(req.params.id); 
  res.json(post); 
}); 
 
router.post("/:id/like", async (req, res) => { 
  const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true 
}); 
  res.json(post); 
}); 
 
router.post("/:id/repost", async (req, res) => { 
  const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { reposts: 1 } }, { new: 
true }); 
  res.json(post); 
}); 
router.post("/:id/share", async (req, res) => { 
const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { shares: 1 } }, { new: true 
}); 
res.json(post); 
}); 

router.post("/:id/comment", async (req, res) => { 
  const post = await Post.findById(req.params.id); 
  post.comments.push({ user: req.session.userId, text: req.body.text }); 
  await post.save(); 
  res.json(post); 
});

router.delete("/:id", async (req, res) => { 
try { 
const post = await Post.findById(req.params.id); 
if (!post) return res.status(404).json({ error: "Post not found" }); 
if (post.userId.toString() !== req.session.userId) { 
return res.status(403).json({ error: "Not authorized to delete this post" }); 
} 
await Post.findByIdAndDelete(req.params.id); 
res.json({ message: "Post deleted" }); 
} catch (err) { 
res.status(500).json({ error: err.message }); 
} 
});

router.delete("/:id/comment/:commentId", async (req, res) => { 
  try { 
    const post = await Post.findById(req.params.id); 
    if (!post) return res.status(404).json({ error: "Post not found" }); 
 
    const comment = post.comments.id(req.params.commentId); 
    if (!comment) return res.status(404).json({ error: "Comment not found" }); 
 
    if (comment.user !== req.session.userId) { 
      return res.status(403).json({ error: "Not authorized to delete this comment" }); 
    } 
 
    comment.deleteOne(); 
    await post.save(); 
    res.json(post); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  } 
});

module.exports = router;