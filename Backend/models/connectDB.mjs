import mongoose from 'mongoose';

const connectDB = async (DATABASE_URL) =>{
    try{
        await mongoose.connect(DATABASE_URL);
        console.log("Database is Connected..");
    }catch(err){
        console.log("Error occured during connection.")
        console.log(Error)
    }
}

export default connectDB;