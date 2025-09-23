import express from "express";
import { adminEmailVerify, adminLoginAccount, adminResendVerificationEmail, registerAdminAccount } from "../../controllers/account/adminAccount.controller.js";

const router = express.Router();

router.post("/register", registerAdminAccount)
router.get("/verify-email", adminEmailVerify )
router.get("/resent-verify-email", adminResendVerificationEmail )

router.post("/login", adminLoginAccount)

export default router;