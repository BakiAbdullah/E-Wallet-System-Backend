import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodValidator, Role } from "./user.validation";
import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

// User routes
router.post("/register", validateRequest(createUserZodValidator), UserControllers.registerUserWithWallet);
router.get("/", checkAuth(Role.ADMIN), UserControllers.getAllUsers);

// Agent routes
router.post("/register-agent", validateRequest(createUserZodValidator), UserControllers.registerAgentWithWallet);
router.get("/agents", checkAuth(Role.ADMIN), UserControllers.getAllAgents);
router.patch("/agent/:id/approve", checkAuth(Role.ADMIN), UserControllers.approveAgent);


export const UserRoutes = router;