import express from "express";
import { deleteUserAccount, getAllAdmin, getAllUserForAdmin, getSinglAdmin, getSingleUser, loginAccount, registerAccount, updateAdminAccount, updateMyAccount, updateUserAccount } from "../../controllers/account/account.controller.js";
import { userVerify } from "../../middleware/userVerify.js";
import { adminVerify } from "../../middleware/adminVerify.js";

const router = express.Router();

//  root => /api/account/

router.post("/register", registerAccount);
router.post("/login", loginAccount);
router.get("/user", userVerify, getSingleUser);
router.put("/updateAll/:userId", userVerify, updateMyAccount); // update all means all information

router.get("/all", adminVerify, getAllUserForAdmin);
router.get("/all-admin", adminVerify, getAllAdmin); /// adminVerify add korte hbe
router.get("/admin", adminVerify, getSinglAdmin);
router.put("/updateStatus/:userId", adminVerify, updateUserAccount); // for admin
router.put("/updateAdminAccount/:adminId", adminVerify, updateAdminAccount);
router.delete("/delete/:accountId", adminVerify, deleteUserAccount); // user and admin deleted access for admin


export default router;