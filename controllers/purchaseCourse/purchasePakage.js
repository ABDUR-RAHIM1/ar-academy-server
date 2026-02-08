
import { serverError } from "../../helpers/serverError.js";
import AdminAccountModel from "../../models/accounts/adminAccountModel.js";
import packageModel from "../../models/courses/packageModel/packageModel.js";
import PurchasePakageModel from "../../models/purchaseCourse/purChasePakage.js";




/**=============== Packages Crated By Admin  ==================== Below */
export const craetePackage = async (req, res) => {
    try {

        const { name, duration, price, description } = req.body;

        const newCourse = await packageModel({
            name,
            duration,
            price,
            description
        });


        await newCourse.save();

        res.status(201).json({
            message: "Packages Created Successfully"
        })

    } catch (error) {
        serverError(res, error)
    }
}

/**=============== Packages Crated By Admin  ==================== Above  */


/* ================== Packages get all by subAdmin and superAdmin Below=================> */
export const getAllPackages = async (req, res) => {
    try {

        const packages = await packageModel.find();

        res.status(200).json(packages);

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server error"
        })
    }
}
/* ================== Packages get all by subAdmin and superAdmin Above =================> */



/**=============== Packages Purchase by Sub Admin ==================== Below */
export const purchasePakage = async (req, res) => {
    try {
        const { packageId } = req.body;
        const subAdminId = req.subAdmin.id;


        if (!packageId) {
            return res.status(400).json({ message: "Package ID is required" });
        }

        // ১. সাব এডমিন চেক
        const subAdmin = await AdminAccountModel.findById(subAdminId);
        if (!subAdmin) {
            return res.status(404).json({ message: 'Sub Admin Not found!' });
        }

        // ২. চেক করা যে আগে থেকেই প্যাকেজ আছে কিনা (তোমার আগের রিকোয়েস্ট অনুযায়ী)
        if (subAdmin.package) {
            return res.status(400).json({ message: "You already have an active package." });
        }

        // ৩. মূল প্যাকেজ টেবিল থেকে ডাটা ফেচ করা (সবচেয়ে গুরুত্বপূর্ণ ধাপ)
        const originalPackage = await packageModel.findById(packageId);
        if (!originalPackage) {
            return res.status(404).json({ message: "Package not found in our records!" });
        };

        // ৪. অরিজিনাল ডাটা দিয়ে পারচেজ রেকর্ড তৈরি করা
        const newPurchase = new PurchasePakageModel({
            name: originalPackage.name,
            duration: originalPackage.duration,
            isActive: true,
            purchasedBy: subAdminId,
            packageId: originalPackage._id,
        });

        const savedPurchase = await newPurchase.save();

        // ৫. এডমিন একাউন্টে রেফারেন্স সেভ করা
        subAdmin.package = savedPurchase._id;
        await subAdmin.save();

        res.status(201).json({
            message: "Package Purchased Successfully",
            package: savedPurchase
        });

    } catch (error) {
        console.log(error)
        serverError(res, error);
    }
};
/**=============== Packages Purchase by Sub Admin ==================== Above */

// ======   get my Package (purchase) ===============> 

export const getMyPackage = async (req, res) => {
    try {

        const subAdminId = req.subAdmin.id;

        const subAdmin = await AdminAccountModel.findById(subAdminId);

        if (!subAdmin) {
            return res.status(404).json({ message: 'Sub Admin Not found!' });
        }

        if (!subAdmin.package) {
            return res.status(400).json({ message: "No active package found." });
        };


        const myPackage = await PurchasePakageModel.findOne({
            purchasedBy: subAdminId,
        }).select("packageId")


        return res.status(200).json(myPackage);

    } catch (error) {
        serverError(res, error);
    }
};


// ======   get my Package (purchase) ^ ===============> 