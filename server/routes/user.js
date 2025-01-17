const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get('/user/:id', requireLogin, async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.id })
        .select('-password')
        .populate('followers', 'name') 
        .populate('following', 'name'); 
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const posts = await Post.find({ postedBy: req.params.id })
        .populate('postedBy', '_id name');
  
      res.json({ user, posts });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
router.put('/follow', requireLogin, async (req, res) => {
    try {
      const followedUser = await User.findByIdAndUpdate(
        req.body.followId,
        {
          $push: { followers: req.user._id },
        },
        { new: true }
      );
  
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      );
  
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(422).json({ error: err });
    }
  });
  
  router.put('/unfollow', requireLogin, async (req, res) => {
    try {
      const unfollowedUser = await User.findByIdAndUpdate(
        req.body.unfollowId,
        {
          $pull: { followers: req.user._id },
        },
        { new: true }
      );
  
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      );
  
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(422).json({ error: err });
    }
  });
  

module.exports = router;
