const express=require("express");//isko import kar rahe hain, routes banane ke liye.
const {createWorkspace,getWorkspaces}=require("../controllers/workspaceController");//Workspace controller ka createWorkspace() function la rahe hain.
const authMiddleware=require("../middleware/authMiddleware");

const router=express.Router();
router.post("/",authMiddleware,createWorkspace);//yaani workspace create karne se pehle login/token check hoga
router.post("/",authMiddleware,getWorkspaces);

module.exports=router;