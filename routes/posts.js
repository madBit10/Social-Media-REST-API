import express from 'express';
import auth from '../middleware/auth.js';
import { check, validationResult } from 'express-validator';
import Post from '../models/posts.js';

const postRouter = express.Router();

postRouter.post('/posts', [auth, [check('title', 'Title is required').not().isEmpty(), check('description', 'Description is required').not().isEmpty()]], async (req,res)=> {
  // check validation errors
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({message: 'Invalid inputs'});
  }

  try {
    // Create a post
    const post = new Post({
      title: req.body.title,
      description: req.body.description,
      author: req.user.id
    });
    await post.save();

    // Return the new post object
    res.json({
      id: post.id,
      title: post.title,
      description: post.description,
      createdAt: post.createdAt
    });
  } catch(error) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});


postRouter.delete('/posts/:id', auth, async (req,res)=> {
  try {
    const post = await Post.findOne({ _id: req.params.id, author: req.user.id });

    if(!post) {
      return res.status(404).json({message: 'Post not found'});
    }

    await Post.deleteOne({_id: req.params.id});

    res.status(204).json({message: 'Post deleted'});
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default postRouter;
