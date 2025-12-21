import express from "express";
import { craetePackage, getAllPackages, purchasePakage } from "../../controllers/purchaseCourse/purchasePakage.js";
import { adminVerify } from "../../middleware/adminVerify.js";
import { subAdminVerify } from "../../middleware/subAdminVerify.js";

//  packages crud and purchase packages crud route

const router = express.Router();

router.post("/create", adminVerify, craetePackage)
router.get("/getAll", getAllPackages)
router.post("/purchase", subAdminVerify, purchasePakage)


export default router 