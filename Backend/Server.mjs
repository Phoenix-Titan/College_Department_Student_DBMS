import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import path from 'path'
import { fileURLToPath } from 'url';

// -----------Files imports
import connectDB from './models/connectDB.mjs';
import allRoutes from './Routes/AllRoutes.mjs'

config()
const app = express();

// ----------Varaible form .env file
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ---------These are the global middleware
app.use('/Profile_Pics_uploads', express.static(path.join(__dirname, 'Profile_Pics_uploads')));
app.use(express.json());
app.use(cors())
// All the routes in the routes folder are used here.
app.use('/api/v1', allRoutes);




// ----------Starting the Server and listening for requests
app.listen(PORT,()=>{
    connectDB(DATABASE_URL)
    console.log(`Server is running on PORT ${PORT} .......`)
})