import jwt from 'jsonwebtoken';



//after executing this code it will execute the next function which is our controller function
const userAuth=async(req,res,next)=>{
    const {token}=req.cookies;

    if(!token){
        return res.json({success:false,message:"Not authorized. Login Again"});

    }

    try {
        //first decode the token which we are getting from the cookies 

        const tokenDecode =jwt.verify(token,process.env.JWT_SECRET);

        if(tokenDecode.id){
           req.user = {
        userId: tokenDecode.id,
        // you can add more fields if needed, like email or role
      };
        }
        else{
            return res.json({success:false,message:"Not Authorized. Login Again!!"});
        }

        next();

    } catch (error) {
        console.log("token error",error)
        res.json({success:false,message:"Server Error!!"})
    }
}

export default userAuth;