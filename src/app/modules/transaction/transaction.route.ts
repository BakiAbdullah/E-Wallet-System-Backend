import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.validation";
import { TransactionControllers } from "./transaction.controller";

const router = Router();

router.get(
  "/history",
  checkAuth(Role.ADMIN),
  TransactionControllers.getAllTransactionHistory
);

router.get(
  "/history/me",
  checkAuth(Role.AGENT, Role.USER),
  TransactionControllers.getMyTransactionHistory
);

router.get(
  "/history/:id",
  checkAuth(Role.ADMIN),
  TransactionControllers.getUserTransactionHistory
);


export const TransactionRoutes = router;