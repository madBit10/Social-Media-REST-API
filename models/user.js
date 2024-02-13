import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchmea = new mongoose.Schema({
  name: {
    type: String, 
    required: true
  },
  email : {
    type:String ,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  posts : [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}]
});

userSchmea.pre('save', async function (next) {
  const user = this;
  if(user.isModified('password') || user.isNew) {
    try {
      const hash = await bcrypt.hash(user.password, 10);
      user.password = hash;
    } catch(error) {
      return next(error);
    }
  }
  next();
});

const User = mongoose.model('User', userSchmea);

export default User;