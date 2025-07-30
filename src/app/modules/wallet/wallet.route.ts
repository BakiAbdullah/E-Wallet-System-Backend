import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { WalletControllers } from "./wallet.controller";
import { Role } from "../user/user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { topUpZodValidator } from "./wallet.validation";

const router = Router();

// 🔼 POST /wallets/top-up
// 🔽 POST /wallets/withdraw
// 🔁 POST /wallets/send-money
// 👁️ GET /wallets/my-wallet
// 📜 GET /wallets/transaction-history

router.post("/top-up", checkAuth(Role.USER, Role.AGENT), validateRequest(topUpZodValidator), WalletControllers.topUpWallet);
router.post("/withdraw", checkAuth(...Object.values(Role)), WalletControllers.withdrawFromWallet);
router.post("/send-money", checkAuth(...Object.values(Role)), WalletControllers.sendMoney);
router.get("/my-wallet", checkAuth(...Object.values(Role)), WalletControllers.getMyWallet);
// router.get("/transaction-history", checkAuth(...Object.values(Role)), WalletControllers.getTransactionHistory);

export const WalletRoutes = router;