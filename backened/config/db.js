const mongoose= require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI) //ye kya krega uri ke through mongodb se connect krega
.then(()=>{                      //agr work kiya toh aisa rhega like if-else ki trh
    console.log("MongoDB connected successfully");
})
.catch((error)=>{
    console.log("MongoDB connextion failed",error);
});