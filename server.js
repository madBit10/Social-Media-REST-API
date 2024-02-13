import express from 'express';
import connectDB from './db.js';
import { config } from 'dotenv';
import router from './routes/users.js';
import authRouter from './routes/auth.js';
import postRouter from './routes/posts.js';

config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', router);
app.use('/api', authRouter);
app.use('/api', postRouter);

app.listen(PORT, ()=>console.log(`Server is listening on the ${PORT}`));

export default app;