import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/userModel.js';
import transporter from '../config/nodeMailer.js';
import { assign } from 'nodemailer/lib/shared/index.js';



//register user controller function
export const register =async(req,res)=>{
    
    const {userName,email,password}=req.body;

    if(!userName || !email || !password){
        return res.status(400).json({success:false,message:"All fields are required"});
    }

    try {

        //if the user exists
        const userExist=await userModel.findOne({email})
        if(userExist){
            return res.status(400).json({success:false,message:"User Already Exists"});
        }
        const hashedPassword =await bcrypt.hash(password,10);

        const user=new userModel({
            userName,
            email,
            password:hashedPassword
        });

        await user.save();


        const token=jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:process.env.NODE_ENV==="production"?"none":"strict",
            maxAge:7*24*60*60*1000
        });

        //sending welcome email
        const mailOptions={
            from: process.env.SENDER_EMAIL,
            to: email,
            subject:"Welcome to Website!!",
            text:`Welcome to my website. Your account has been created with the email Id: ${email}`
        }

        await transporter.sendMail(mailOptions);
        console.log("Mail sent successfully");
        

        return res.json({success:true,message:"User Registered Successfully!!"});

    } catch (error) {
        console.log("Register User Error",error);
        res.status(500).json({success:false,message:"Server Error"})
    }

}

//login user controller function 

export const login=async(req,res)=>{
    const {email,password}=req.body;
    
    if(!email || !password){
      return  res.status(400).json({success:false,message:"All fields are required!!"})
    }

    try {
        const user=await userModel.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:"User do not exist!!"});

        }
        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({success:false,message:"Invalid Password!!"});

        }
         const token=jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:process.env.NODE_ENV==="production"?"none":"strict",
            maxAge:7*24*60*60*1000
        })

        return res.json({success:true,message:"Loged In successfully!!"});
    } catch (error) {
        console.log("login user error");
        return res.status(500).json({success:false,message:"Login server error"});
        
    }
}

//logout user controller function

export const logout=async(req,res)=>{
     try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:process.env.NODE_ENV==="production"?"none":"strict",
            
        })

        return res.json({success:true,message:"LogOut successfully!!"});
     } catch (error) {
        console.log("logout error");
        return res.status(500).json({success:false,message:"logout server error"});
     }
} 

//send verification otp to the user controller function
export const sendVerifyOtp=async(req,res)=>{
   try {
    console.log("req.body =>", req.body);
    const {userId}=req.user;
    // console.log(userId);

    const user=await userModel.findById(userId);
    if(user.isAccountVerified){
        return res.json({success:false,message:"User Account already verified!!"})
    }
    //now the account is not verified so otp will be send to the email id for which we are using the MATH random function
    const otp=String(Math.floor(100000 + Math.random() * 900000));

    //save the otp for the user in the database 
    user.verifyOTP=otp;
    user.verifyOTPExpireAt=Date.now()+24*60*60*1000;

    await user.save();

    const mailOptions={
        from:process.env.SENDER_EMAIL,
        to :user.email,
        subject:'Account Verification OTP',
        text:`Your OTP is ${otp}. Verify account using this OTP`
    }

    await transporter.sendMail(mailOptions)


    console.log("Otp mail sent successfully!!");
    return res.status(200).json({success:true,message:"OTP has been sent successfully!!"});

   } catch (error) {
      console.log("verification Otp can't be send!",error)
      return res.status(500).json({success:false,message:"VerifyOtp server error!!"});
   }
}
//verify the email using the otp
export const verifyEmail=async(req,res)=>{

    //how can user send its user id in the body so we need a middleware to take the userid from the cookie 
   const {userId}=req.user;
   const {otp}=req.body;

   if(!userId || !otp){
     return res.status(400).json({success:false,message:"Invalid OTP!"});
   }
   try {
      const user=await userModel.findById(userId);
      if(!user){
        return res.json({success:false,message:"User not found!!"});

      }
      if(user.verifyOTP==='' || user.verifyOTP!==otp){
        return res.json({success:false,message:"Invalid OTP!!!"})
      }
      if(user.verifyOTPExpireAt< Date.now()) return res.json({success:false,message:"OTP Expired!!"});
      
      user.isAccountVerified=true;
      user.verifyOTP='';
      user.verifyOTPExpireAt=0;

      await user.save();

      return res.status(200).json({success:true,message:"Account is verified successfully!!"});


   } catch (error) {
    console.log("Verification of email failed!",error);
    return res.status(500).json({success:false,message:"Verification Server error!!"});
   }

}

//check if the user is authenticated or not or check whether the user is logged in or not
export const isAuthenticated=async(req,res)=>{
   try {
     return res.status(200).json({success:true,message:"Authentication verification successfully!!"});
   } catch (error) {
    console.log("Authentication verification Failed!",error);
    return res.status(500).json({success:false,message:"Server Error!!"});
   }
}

//send password reset otp
export const sendResetOtp=async(req,res)=>{
    const {email}=req.body;
     
    if(!email) {
        return res.status(400).json({success:false,message:"Email ID do not exist!!"});
    }
    try {
        const user=await userModel.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:"User do not exist!!"});
        }
        const otp=String(Math.floor(100000 + Math.random() * 900000));
         //save the otp into the database
        user.resetOtp=otp;
        user.resetOtpExpiredAt=Date.now()+10*60*1000;

        await user.save();

        const mailOptions={
            from: process.env.SENDER_EMAIL,
            to: email,
            subject:"Password Reset OTP",
            text:`OTP for reseting your password is ${otp}.Use this OTP to proceed further!`
        }
        await transporter.sendMail(mailOptions);
        return res.status(200).json({success:false,message:"Password Reset OTP send Successfully!!"});

    } catch (error) {
        console.log("Password reset Otp is failed!!",error);
        return res.status(500).json({success:false,message:"Reset Otp server Error!!"});
    }
}
//reset user password 
export const resetPassword=async(req,res)=>{
    const {email,otp,newPassword}=req.body;

    if(!email || !otp || !newPassword){
        return res.status(400).json({success:false,message:"Email,OTP and new password required!!"});
    }
    try {
        const user=await userModel.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:"User does not exist!!"});
        }
        if(user.resetOtp==="" || user.resetOtp!==otp){
            return res.status(400).json({success:false,message:"Invalid OTP!!"});
        }
        if(user.resetOtpExpiredAt < Date.now()){
            return res.status(400).json({success:false,message:"OTP Expired!!"});
        }

        // encrypt the new password and store in the database
        const hashedPassword=await bcrypt.hash(newPassword,10);
        user.password=hashedPassword;
        user.resetOtp='';
        user.resetOtpExpiredAt=0;

        await user.save();

        return res.status(200).json({success:false,message:"Password Reset Successfully!!"});
    } catch (error) {
        console.log("reset password error",error);
        return res.status(500).json({success:false,message:"reset password server error!!"});
    }
    
}