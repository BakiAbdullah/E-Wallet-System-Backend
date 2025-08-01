import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodValidator, Role } from "./user.validation";
import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.post("/register", validateRequest(createUserZodValidator), UserControllers.registerUserWithWallet);

router.post("/register-agent", validateRequest(createUserZodValidator), UserControllers.registerAgentWithWallet);

router.get("/", checkAuth(Role.ADMIN), UserControllers.getAllUsers);

export const UserRoutes = router;