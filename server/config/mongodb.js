import mongoose from "mongoose";

const connectDB= async ()=>{
     try{

     
    mongoose.connection.on('Connected',()=>{
        console.log("Database Connected")
    });

    const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/authentication`);
    console.log(`\n DATABASE CONNECTED!! DB HOST:${connectionInstance.connection.host}`);
     }
     catch(error){
        console.log("MongoDB connection Error!!",error)
        throw(error)
        process.exit(1);
     }
};
    export default connectDB;
