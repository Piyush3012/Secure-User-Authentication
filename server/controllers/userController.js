import { userModel } from "../models/userModel.js";

export const getUserData=async (req,res)=>{
   try {
    const {userId}=req.user;

    const user=await userModel.findById(userId);

    if(!user){
        return res.status(400).json({success:false,message:"User do not exist!!"});
    }

    res.json({
        success:true,
        userData:{
            name:user.userName,
            isAcountVerified:user.isAccountVerified
        }
    })


   } catch (error) {
   console.log("get user data error",error);
    return res.status(500).json({success:false,message:"user data server Error!!"});
   }
}