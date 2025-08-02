import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { WalletControllers } from "./wallet.controller";
import { Role } from "../user/user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { topUpZodValidator } from "./wallet.validation";

const router = Router();

router.post(
  "/top-up",
  checkAuth(Role.AGENT, Role.USER),
  validateRequest(topUpZodValidator),
  WalletControllers.topUpWallet
);
router.post(
  "/withdraw",
  checkAuth(...Object.values(Role)),
  validateRequest(topUpZodValidator),
  WalletControllers.withdrawFromWallet
);
router.post(
  "/send-money",
  checkAuth(Role.USER, Role.AGENT),
  WalletControllers.sendMoney
);

router.get(
  "/my-wallet",
  checkAuth(...Object.values(Role)),
  WalletControllers.getMyWallet
);

router.patch(
  "/block/:walletId",
  checkAuth(Role.ADMIN),
  WalletControllers.blockWallet
);

router.patch(
  "/unblock/:walletId",
  checkAuth(Role.ADMIN),
  WalletControllers.unBlockWallet
);

export const WalletRoutes = router;
