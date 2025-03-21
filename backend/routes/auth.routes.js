import {Router} from "express"
import {userRegister,userLogin,userLogout,completeUserProfile, getUserProfile} from "../controllers/auth.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register",userRegister);
router.post("/login",userLogin);


router.post('/register/complete-profile', completeUserProfile);


router.get("/logout",userLogout);

router.get("/get-profile",authMiddleware,getUserProfile)

export default router;