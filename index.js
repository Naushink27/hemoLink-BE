import { configDotenv } from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
const dotenv=configDotenv();

configDotenv()

const app=express();

app.use(cors());
app.use(express.json());

connectDB();

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})
