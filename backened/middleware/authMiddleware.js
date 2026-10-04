const jwt=require("jsonwebtoken");
const authMiddleware=(req,res,next)=>{//ye wahi package hai jo humne login ke liye install kiya tha.
    try{
        const authHeader=req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({
                message: "No token provided"
            });
        }
        const token=authHeader.split(" ")[1];//request ke headers se Authorization read kar rahe hain.
        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        req.user =decoded;//Decoded user information ko request ke andar store krdiiya
        next();
        } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};
module.exports=authMiddleware;
