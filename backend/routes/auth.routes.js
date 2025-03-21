import {Router} from "express"
import {userRegister,userLogin,userLogout,selectUserRole,completeUserProfile} from "../controllers/auth.controller.js"

const router = Router();

router.post("/register",userRegister);
router.post('/register/role', selectUserRole);
router.post('/register/complete-profile', completeUserProfile);


router.post("/login",userLogin);
router.get("/logout",userLogout);

export default router;