import express from "express";
import { craetePackage, getAllPackages, getAllPurchasedPackages, getMyPackage, purchasePakage, updatePurchasePackageStatus } from "../../controllers/purchaseCourse/purchasePakage.js";
import { adminVerify } from "../../middleware/adminVerify.js";
import { subAdminVerify } from "../../middleware/subAdminVerify.js";


//  packages crud and purchase packages crud route

const router = express.Router();

router.post("/create", adminVerify, craetePackage)
router.get("/getAll", getAllPackages);
router.get("/getAllPurchesed", adminVerify, getAllPurchasedPackages);
router.post("/purchase", subAdminVerify, purchasePakage);
router.get("/getMyPackage", subAdminVerify, getMyPackage);
router.put("/statusUpdate", adminVerify, updatePurchasePackageStatus);


export default router 