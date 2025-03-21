import {Router} from "express"
import {userRegister,userLogin,userLogout,selectUserRole,completeUserProfile} from "../controllers/auth.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register",userRegister);
router.post("/login",userLogin);

router.use(authMiddleware)
router.post('/register/role', selectUserRole);
router.post('/register/complete-profile', completeUserProfile);


router.get("/logout",userLogout);

export default router;