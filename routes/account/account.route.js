import express from "express";
import { deleteOnlySubAdminStudentsAccount, deleteUserAccount, emailVerify, getAllAdmin, getAllStudentBySubAdmin, getAllUserForAdmin, getSinglAdmin, getSingleUser, loginAccount, registerAccount, resendVerificationEmail, updateAdminAccount, updateOnlySubAdminStudentAccountStatus, updateUserAccount, updateUserAccountStatus } from "../../controllers/account/account.controller.js";
import { userVerify } from "../../middleware/userVerify.js";
import { adminVerify } from "../../middleware/adminVerify.js";
import { subAdminVerify } from "../../middleware/subAdminVerify.js";

const router = express.Router();

//  root => /api/account/

router.post("/register", registerAccount);

router.get("/verify-email", emailVerify) // ata sudhu verify er shomoy cholbe 
router.post("/resend-verification-email", resendVerificationEmail);


router.post("/login", loginAccount);
router.get("/user", userVerify, getSingleUser);
router.get("/subStudent", subAdminVerify, getAllStudentBySubAdmin);



router.get("/all", adminVerify, getAllUserForAdmin);
router.get("/all-admin", adminVerify, getAllAdmin); /// adminVerify add korte hbe
router.get("/admin", adminVerify, getSinglAdmin);
router.put("/updateStatus/:userId", adminVerify, updateUserAccountStatus); // for admin
router.put("/updateAdminAccount/:adminId", adminVerify, updateAdminAccount);
router.delete("/delete/:accountId", adminVerify, deleteUserAccount); // user and admin deleted access for admin

router.delete("/subDelete/:accountId", subAdminVerify, deleteOnlySubAdminStudentsAccount)
router.put("/updateStatusBySubAdmin/:studentId", subAdminVerify, updateOnlySubAdminStudentAccountStatus); // for admin

router.put("/userUpdate/:userId", updateUserAccount)

export default router;