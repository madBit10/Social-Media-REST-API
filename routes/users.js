import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();
import User from '../models/user.js';


router.get('/user', auth, async(req,res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    const userName = user.name;

    res.json({name : userName});
  } catch(error) {
    console.error(error.message);
    res.status(500).send('Server Errror');
  }
});

// Create a new user
router.post('/register', async(req,res) => {
  const { name, email, password } = req.body;

  // Create a new user with the provided name

  const user = new User({ name, email, password });
  await user.save();

  // Return the new user as JSON
  res.json(user);

});

export default router;