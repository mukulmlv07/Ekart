const jwt=require("jsonwebtoken");
module.exports = (req,res,next)=>{
    try{
        //console.log(req.headers.authorization)
        const token= req.header('Authorization').split(" ")[1];
        const decoded=jwt.verify(token,process.env.JWT_KEY);
        // console.log(decoded,'Decoded Token')
        req.userData=decoded;
        //console.log(req.userData)
        next();
    }
    catch(error){
        res.status(401).json({
            message:"AUth Failed",
            error:error
        })
    }
}