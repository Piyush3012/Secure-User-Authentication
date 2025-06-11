import mongoose, { Schema } from "mongoose";

const userSchema=new Schema({
    userName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        index:true
    },
     password:{
        type:String,
        required:[true,'Password is Required'],
    },
    verifyOTP:{
        type:String,
        default:""
    },
    verifyOTPExpireAt:{
        type:Number,
        default:0
    },
    isAccountVerified:{
        type:Boolean,
        default:false 
    },
    resetOtp:{
        type:String,
        default:""
    },
    resetOtpExpiredAt:{
        type:Number,
        default:0
    }
},{timestamps:true});

export const userModel=mongoose.models.userModel ||mongoose.model("userModel",userSchema);  