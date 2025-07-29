import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodValidator } from "./user.validation";
import { UserControllers } from "./user.controller";

const router = Router();

router.post("/register", validateRequest(createUserZodValidator), UserControllers.createUser);

router.get("/", UserControllers.getAllUsers);

export const UserRoutes = router;