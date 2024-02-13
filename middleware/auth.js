import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export default async function auth(req,res,next) {

  if(!req.headers.authorization) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = req.headers.authorization.split(' ')[1];
  // console.log(req);

  // check if the token exists
  if (!token) {
    return res.status(401).json({message: 'Unauthorized'});
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    // Add another user info to request object
    const user = await User.findById(decoded.userId);
    if(!user) {
      return res.status(400).json({message: 'User does not exists'});
    }
    req.user = user;

    // call the next middleware

    next();
  } catch(error) {
    res.status(401).json({message: 'Invalid token'});
  }

}