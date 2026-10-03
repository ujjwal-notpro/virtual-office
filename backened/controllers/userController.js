const User=require("./models/User");//controller ko usermodele mil rha hai
const createUser=async(req,res)=>{
    try{
        const user=await User.create(req.body);

        res.status(201).json({
            message:"User created successfully",
            user:user
        });
    }catch(error){
        res.status(201).json({
            message:"User created successfully",
            error:error.message
        });    
    }
};
module.exports={createUser};