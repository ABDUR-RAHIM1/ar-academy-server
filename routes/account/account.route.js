import express from "express";
import { deleteUserAccount, getAllUserForAdmin, getSingleUser, loginAccount, registerAccount, updateMyAccount, updateUserAccount } from "../../controllers/account/account.controller.js";
import { userVerify } from "../../middleware/userVerify.js";

const router = express.Router();

//  root => /api/account/

router.post("/register", registerAccount);
router.post("/login", loginAccount);
router.get("/all", getAllUserForAdmin);
router.get("/user", userVerify, getSingleUser);
router.put("/updateStatus/:userId", userVerify, updateUserAccount); // for admin
router.put("/updateAll/:userId", userVerify, updateMyAccount);
router.delete("/delete/:userId", userVerify, deleteUserAccount);


export default router;