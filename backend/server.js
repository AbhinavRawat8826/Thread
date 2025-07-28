import express from 'express'
import dotnev from 'dotenv'
import connectDB from './db/connectDB.js'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js' 
import { v2 as cloudinary } from "cloudinary";
import path from'path'
import job from "./utils/cron.js";
 

dotnev.config() 
connectDB()


const app = express()
const __dirname = path.resolve();

job.start()


cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.use(express.json({ limit: '10mb' }));  
app.use(express.urlencoded({ limit: '10mb', extended: true })); 
app.use(cookieParser())




app.use('/api/users',userRoutes)
app.use('/api/posts',postRoutes)

app.get('/ping', (req, res) => {
    res.status(200).send('pong 🏓');
  });

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}



const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>console.log('server start at PORT :',PORT))


