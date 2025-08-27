import express from 'express'
import cors from 'cors'
import 'dotenv/config' 
import cookieParser from 'cookie-parser'
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';


const app=express();
const port=process.env.PORT || 3000

const allowedOrigin=['https://secure-user-authentication-1x1i.onrender.com']

connectDB()

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({credentials:true,origin:"*"}));

//api endpoints 
app.get('/',(req,res)=>{
    res.send("API is working")
})
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter)
app.listen(port,()=>{
    console.log(`Server is running on the port :${port}`)
});


