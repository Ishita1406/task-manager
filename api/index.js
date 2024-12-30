import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import taskRouter from './routes/task.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(express.json());

const port = 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB', error);
    });


app.use(cookieParser());

app.use(cors());

app.use('/api/auth', userRouter);

app.use('/api/task', taskRouter);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'client', 'dist')));

app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'client', 'dist', 'index.html');
    res.sendFile(indexPath);
});



app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message,
    });
});