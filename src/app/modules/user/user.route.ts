import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodValidator, Role } from "./user.validation";
import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

// User routes
router.post(
  "/register",
  validateRequest(createUserZodValidator),
  UserControllers.registerUserWithWallet
);
router.get("/", UserControllers.getAllUsers);
router.get(
  "/me",
  checkAuth(...Object.values(Role)),
  UserControllers.getUserProfile
);

// Agent routes
router.post(
  "/register-agent",
  validateRequest(createUserZodValidator),
  UserControllers.registerAgentWithWallet
);
router.patch(
  "/agent/:id/approve",
  checkAuth(Role.ADMIN),
  UserControllers.approveAgent
);
router.patch(
  "/agent/:id/reject",
  checkAuth(Role.ADMIN),
  UserControllers.rejectAgent
);

export const UserRoutes = router;
