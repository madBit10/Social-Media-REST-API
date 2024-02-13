import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import bcrypt from 'bcrypt';

const authRouter = express.Router();

authRouter.post('/authenticate', async (req, res)=> {
  const { email, password } = req.body;
  if(!email) {
    return res.status(400).json({message: '"email" is required'});
  }
  if(!password) {
    return res.status(400).json({message: '"password is required"'});
  }

  // Find user by email
  const user = await User.findOne({email});
  // If user doesnot exist or password is incorrect return an error
  if(!user) {
    return res.status(401).json({message: 'Email or password is incorrect'});
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if(!validPassword) {
    return res.status(401).json({message: 'Email or password is incorrect'});
  }

  // Generate a JWT token with the user ID as payload
  const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET);

  res.json({token});
});

export default authRouter;