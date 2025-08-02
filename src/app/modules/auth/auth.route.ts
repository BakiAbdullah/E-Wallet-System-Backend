import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.validation";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);
router.post("/change-password", checkAuth(...Object.values(Role)), AuthControllers.changePassword);

export const AuthRoutes = router;
