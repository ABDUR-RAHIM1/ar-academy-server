//  get Chapter contents Using By Sub Categorie Identifier 
export const getChapterByIdentifier = async (req, res) => {
    const { subIdentifier } = req.params;

    if (!subIdentifier) {
        return res.status(404).json({ message: "Chapter Name Missing!" });
    }

    try {
        const chapter = await ChaptersModel.findOne({
            identifier: { $regex: `^${subIdentifier}$`, $options: "i" },
        });

        if (!chapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }

        // ✅ যদি ফ্রি হয় বা type না থাকে তাহলে ফ্রি হিসেবেই পাঠাও
        if (!chapter.type || chapter.type === "free") {
            return res.status(200).json(chapter);
        }

        // ✅ পেইড হলে ইউজার লাগবে
        if (!req.user) {
            return res.status(401).json({ message: "এই অধ্যায় দেখতে হলে আপনাকে লগইন করতে হবে।" });
        }

        // ✅ ইউজারের প্ল্যান মেয়াদ শেষ হয়েছে কিনা চেক ও আপডেট করো
        const plan = await checkAndUpdatePurchasePlanStatus(req.user.id);

        if (!plan || plan.status === "expired") {
            return res.status(403).json({ message: "এই অধ্যায়টি দেখতে হলে আপনাকে প্ল্যান কিনতে হবে।" });
        }

        // ✅ সব ঠিক থাকলে চ্যাপ্টার পাঠাও
        res.status(200).json(chapter);

    } catch (error) {
        console.error("Chapter fetch failed:", error);
        res.status(500).json({ message: "Chapter Fetch Failed" });
    }
};



//  ager  
// export const getChapterByIdentifier = async (req, res) => {
//     const { subIdentifier } = req.params;
//    console.log("getChapterByIdentifier")
//     if (!subIdentifier) {
//         return res.status(404).json({ message: "Chapter Name Missing!" });
//     }

//     try {

//         const chapter = await ChaptersModel.findOne({
//             identifier: { $regex: `^${subIdentifier}$`, $options: "i" },
//         })
//         // .sort({ position: 1, _id: 1 })

//         if (!chapter) {
//             return res.status(404).json({ message: "Chapter not found" });
//         }

//         res.status(200).json(chapter);
//     } catch (error) {
//         res.status(500).json({ message: "Chapter Fetch Failed" });
//     }
// };
