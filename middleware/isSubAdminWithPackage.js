// middleware/authMiddleware.js

import { roles } from "../config/constans.js";
import AdminAccountModel from "../models/accounts/adminAccountModel.js";

export const isSubAdminWithPackage = async (req, res, next) => {
    try {
        const admin = await AdminAccountModel.findById(req.subAdmin.id);

        if (!admin) {
            return res.status(404).json({ message: "Sub Admin not found" });
        }

        // 1. Role Check (Jodi role name thake)
        if (admin.role !== roles.subAdmin) {
            return next(); // Jodi main admin hoy, baki route access korte parbe
        }

        // 2. Package Check
        if (!admin.package) {
            return res.status(403).json({
                message: "Access Denied. Please purchase a package to continue.",
                needPackage: true
            });
        }

        // 3. (Optional) Expiry Check o ekhane korte paro
        // Jodi package thake, next() call hobe
        next();

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" });
    }
};