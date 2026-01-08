import express from "express";
import { signUpUser } from "../controllers/user.controller.js";
import { authenticateToken } from "../middlewares/auth.js";
import isAdminOnly from "../middlewares/isAdminOnly.js" 
import activateUser from "../controllers/admin.controller.js";
/** ################### Admin Routes ################### **/

const adminRouter = express.Router();

adminRouter.post("/createUser", authenticateToken, isAdminOnly, signUpUser);
adminRouter.post("/userActivaion", authenticateToken, isAdminOnly, activateUser)
// adminRouter.post('/fetchRole',     findRole);
// adminRouter.delete('/removeRole', deleteRole);
// adminRouter.get('/fetchAllRoles', fetchAllRoles);
// adminRouter.put('/updateRole',    updateRole);

export default adminRouter;
