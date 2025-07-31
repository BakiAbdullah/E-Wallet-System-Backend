import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { WalletControllers } from "./wallet.controller";
import { Role } from "../user/user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { topUpZodValidator } from "./wallet.validation";

const router = Router();

router.post(
  "/top-up",
  checkAuth(Role.AGENT),
  validateRequest(topUpZodValidator),
  WalletControllers.topUpWallet
);
router.post(
  "/withdraw",
  checkAuth(...Object.values(Role)),
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

export const WalletRoutes = router;
