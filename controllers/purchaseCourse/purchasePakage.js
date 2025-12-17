import PurchasePakage from "../models/PurchasePakage.js";
import { serverError } from "../../helpers/serverError.js";

//  agulor kaj kora hoyni ekhono
export const purchasePakage = async (req, res) => {
    try {
        const { name, duration } = req.body;
        const subAdminId = req.subAdmin.id;

        if (!name || !duration) {
            return res.status(400).json({ message: "Name and duration required" });
        }

        const newPackage = new PurchasePakage({
            name,
            duration,
            isActive: true,
            createdBy: subAdminId,
        });

        const savedPackage = await newPackage.save();

        res.status(201).json({ message: "Package created", package: savedPackage });
    } catch (error) {
        serverError(res, error);
    }
};
