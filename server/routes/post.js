const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")

router.get("/allpost", requireLogin, (req, res) => {
    Post.find()
      .populate("postedBy", "_id name")
      .then((posts) => {
        res.json(posts);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      });
  });

  router.get("/getsubpost", requireLogin, (req, res) => {
    Post.find({ postedBy: { $in: req.user.following } })
      .populate("postedBy", "_id name")
      .then((posts) => {
        res.json(posts);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      });
  });
  
  router.post("/createpost", requireLogin, (req, res) => {
    const { title, body, photo } = req.body;
    if (!body || !title || !photo) {
      return res.status(422).json({ error: "Please add all the fields" });
    }
    // Ensure you have a valid user object
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const post = new Post({
      title,
      body,
      photo,
      postedBy: req.user, // Make sure req.user is properly defined
    });
    post
      .save()
      .then((result) => {
        res.json({ post: result });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      });
  });
  
  router.get("/mypost", requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
      .populate("postedBy", "_id name")
      .then((myposts) => {
        res.json(myposts);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      });
  });
  
  router.put('/like', requireLogin, async (req, res) => {
    const postId = req.body.postId;
  
    try {
      const result = await Post.findByIdAndUpdate(
        postId,
        { $push: { likes: req.user._id } },
        { new: true }
      ).exec();
  
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  router.put('/unlike', requireLogin, async (req, res) => {
    const postId = req.body.postId;
  
    try {
      const result = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: req.user._id } },
        { new: true }
      ).exec();
  
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.put('/comment', requireLogin, async (req, res) => {
    try {
      const comment = {
        text: req.body.text,
        postedBy: req.user._id,
      };
  
      const updatedPost = await Post.findByIdAndUpdate(
        req.body.postId,
        {
          $push: { comments: comment },
        },
        {
          new: true,
        }
      )
        .populate("comments.postedBy", "_id name")
        .exec();
  
      res.json(updatedPost);
    } catch (err) {
      console.error(err);
      res.status(422).json({ error: err.message });
    }
  });

  router.delete('/deletepost/:postId', requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.postId })
      .populate('postedBy', '_id')
      .then((post) => {
        if (!post) {
          return res.status(422).json({ error: 'Post not found' });
        }
  
        if (post.postedBy._id.toString() !== req.user._id.toString()) {
          return res.status(401).json({ error: 'You are not authorized to delete this post' });
        }
  
        return post.deleteOne()
          .then(() => {
            res.json({ message: 'Successfully deleted' });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
          });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      });
  });
  
  
  
  
  
  module.exports = router