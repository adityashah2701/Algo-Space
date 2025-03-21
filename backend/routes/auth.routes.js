import {Router} from "express"
import {userRegister,userLogin,userLogout,completeUserProfile} from "../controllers/auth.controller.js"

const router = Router();

router.post("/register",userRegister);
router.post("/login",userLogin);


router.post('/register/complete-profile', completeUserProfile);


router.get("/logout",userLogout);

export default router;