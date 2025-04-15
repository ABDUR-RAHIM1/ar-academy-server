import express from "express";
import { deleteUserAccount, getAllUserForAdmin, loginAccount, registerAccount, updateUserAccount } from "../../controllers/account/account.controller.js";
import { userVerify } from "../../middleware/userVerify.js";

const router = express.Router();

//  root => /api/account/

router.post("/register", registerAccount);
router.post("/login", loginAccount);
router.get("/all", getAllUserForAdmin);
router.put("/update/:userId", userVerify, updateUserAccount);
router.delete("/delete/:userId", userVerify, deleteUserAccount);


export default router;