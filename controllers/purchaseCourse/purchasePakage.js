import { serverError } from "../../helpers/serverError.js";
import AdminAccountModel from "../../models/accounts/adminAccountModel.js";
import packageModel from "../../models/courses/packageModel/packageModel.js";
import PurchasePakageModel from "../../models/purchaseCourse/purChasePakage.js";


/**=============== Packages Crated By Admin  ==================== Below */
export const craetePackage = async (req, res) => {
    try {

        const { name, duration, price, description } = req.body;

        const newCourse = await packageModel.create({
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


/* ================== Packages get all by subAdmin and superAdmin Below  ============> */
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



/* ================== Get All Purchased Packages by admin Below  ============> */
export const getAllPurchasedPackages = async (req, res) => {
    try {

        const purchased = await PurchasePakageModel.find()
            .populate("subAdmin", "username email phone _id")

        res.status(200).json(purchased);

    } catch (error) {

        return res.status(500).json({
            message: "Internal Server error"
        })
    }
}
/* ================== Get All Purchased Packages by admin Above =================> */




/**=============== Packages Purchase by Sub Admin ==================== Below */

export const purchasePakage = async (req, res) => {
    try {

        const { packageId, senderNumber, transactionId, method: paymentMethod, paidAmount } = req.body;

        const { id, role } = req.subAdmin;

        // ১. বেসিক ভ্যালিডেশন
        if (!id) return res.status(401).json({ message: "Unauthorized" });
        if (!packageId) return res.status(400).json({ message: "কোর্স আইডি প্রয়োজন" });

        //  course mean package 
        const isPackage = await packageModel.findById(packageId);
        const subAdmin = await AdminAccountModel.findById(id);

        if (!isPackage) return res.status(404).json({ message: "কোর্স পাওয়া যায়নি" });
        if (!subAdmin) return res.status(404).json({ message: "ইউজার পাওয়া যায়নি" });

        // ২. ডুপ্লিকেট চেক (অলরেডি কেনা বা পেন্ডিং আছে কিনা)
        const alreadyInPurchaseList = await PurchasePakageModel.findOne({
            subAdmin: id,
            package: packageId
        });

        if (alreadyInPurchaseList) {
            if (alreadyInPurchaseList.status === 'active') {
                return res.status(400).json({ message: "আপনি ইতিমধ্যে এই কোর্সটি কিনেছেন" });
            }
            if (alreadyInPurchaseList.status === 'pending') {
                return res.status(400).json({ message: "আপনার একটি পেমেন্ট রিকোয়েস্ট ইতিমধ্যে পেন্ডিং আছে" });
            }
        }

        // ৩. কোর্স টাইপ নির্ধারণ (Free vs Paid)
        const isFree = Number(isPackage.price) <= 0;

        let purchaseData = {
            subAdmin: id,
            role: role,
            package: packageId,
            packageOfferPrice: Number(isPackage.price),
            paidAmount: isFree ? 0 : Number(paidAmount),
        };

        if (isFree) {
            // --- ফ্রি কোর্সের লজিক ---
            purchaseData.status = "active";
            purchaseData.paymentDetails = {
                paymentMethod: "free",
                paymentStatus: "completed"
            };

            // ফ্রি হলে সরাসরি একাউন্টে কোর্স অ্যাড হবে
            await AdminAccountModel.findByIdAndUpdate(id, {
                $set: { package: packageId },
            });

        } else {
            // --- পেইড কোর্সের লজিক ---
            if (!transactionId || !senderNumber || !paidAmount) {
                return res.status(400).json({ message: "পেমেন্ট তথ্য এবং টাকার সঠিক পরিমাণ দিন" });
            }

            // সিকিউরিটি নোট: যদি amount < course.offerPrice হয়, তাও আমরা 'pending' রাখছি।
            // অ্যাডমিন ড্যাশবোর্ডে গিয়ে কোর্স অফার প্রাইস এবং পেইড অ্যামাউন্ট তুলনা করে ডিসিশন নিবেন।

            purchaseData.status = "pending";
            purchaseData.paymentDetails = {
                transactionId,
                paymentMethod,
                senderNumber,
                paymentStatus: "pending"
            };
        }

        // ৪. ডাটাবেসে সেভ করা
        const newPurchase = new PurchasePakageModel(purchaseData);
        await newPurchase.save();

        return res.status(201).json({
            status: isFree ? 200 : 201,
            message: isFree
                ? "সফলভাবে প্যাকেজ যুক্ত হয়েছে ✅"
                : "আপনার পেমেন্ট রিকোয়েস্ট জমা হয়েছে। আমাদের অ্যাডমিন প্যানেল তথ্য যাচাই করে আপনাকে দ্রুত এক্সেস দিয়ে দিবে। ⏳"
        });

    } catch (error) {
        console.error("Purchase Course Error:", error);
        return res.status(500).json({ message: "সার্ভার এরর! দয়া করে আবার চেষ্টা করুন।" });
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
            subAdmin: subAdminId,
        }).select("package")



        return res.status(200).json(myPackage);

    } catch (error) {
        serverError(res, error);
    }
};
// ======   get my Package (purchase) ^ ===============>    


//  payment Status update and access the course
export const updatePurchasePackageStatus = async (req, res) => {
    const { purchaseId, newStatus } = req.body;


    if (!purchaseId || !newStatus) {
        return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    try {
        // ৩. পারচেজ রেকর্ডটি খুঁজে বের করা
        const purchase = await PurchasePakageModel.findById(purchaseId)
        if (!purchase) {
            throw new Error("Purchase record not found.");
        }

        // ৪. যদি আগে থেকেই একটিভ থাকে এবং আবারও একটিভ করতে বলা হয় 
        if (purchase.status === 'active' && newStatus === 'active') {
            throw new Error("This enrollment is already active.");
        }

        // ৫. যদি স্ট্যাটাস 'active' করতে বলা হয়, তবে স্টুডেন্টের একাউন্টে কোর্স ঢুকিয়ে দিন
        if (newStatus === 'active') {
            await AdminAccountModel.findByIdAndUpdate(
                purchase.subAdmin,
                { $set: { package: purchase.package } },
            );
        }


        //  jodi payment statuc active na hoy tahole account theke courseId remove hobe 
        if (newStatus !== 'active' && purchase.status === 'active') {
            await AdminAccountModel.findByIdAndUpdate(
                purchase.subAdmin,
                { $unset: { package: "" } }
            );
        }

        // ৭. পারচেজ স্ট্যাটাস আপডেট করা
        purchase.status = newStatus;
        await purchase.save();

        return res.status(200).json({
            success: true,
            message: `Status updated to ${newStatus} successfully.`,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong during status update."
        });
    }
};

