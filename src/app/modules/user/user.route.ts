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

router.patch(
  "/block/:userId",
  checkAuth(Role.ADMIN),
  UserControllers.blockUser
);
router.patch(
  "/unblock/:userId",
  checkAuth(Role.ADMIN),
  UserControllers.unblockUser
);

// Agent routes
router.post(
  "/register-agent",
  validateRequest(createUserZodValidator),
  UserControllers.registerAgentWithWallet
);
router.patch(
  "/agent/toggle-approval/:agentId",
  checkAuth(Role.ADMIN),
  UserControllers.toggleAgentApproval
);
router.patch(
  "/agent/verify/:agentId",
  checkAuth(Role.ADMIN),
  UserControllers.verifyAgent
);

export const UserRoutes = router;
