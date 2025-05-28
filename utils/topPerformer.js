import ResultsModel from "../models/results/results.model.js";
import { serverError } from "../helpers/serverError.js";

export const getBestPerformers = async (req, res) => {
    try {
        const performers = await ResultsModel.aggregate([
            {
                $group: {
                    _id: "$user",
                    totalCorrect: { $sum: { $toInt: "$correctAns" } },
                    totalQuestions: { $sum: { $toInt: "$totalQuestions" } },
                },
            },
            {
                $addFields: {
                    percentage: {
                        $cond: [
                            { $eq: ["$totalQuestions", 0] },
                            0,
                            { $multiply: [{ $divide: ["$totalCorrect", "$totalQuestions"] }, 100] },
                        ],
                    },
                },
            },
            {
                $sort: { percentage: -1 },
            },
        ]);

        // এখন populate করতে হবে ইউজারদের নাম এবং প্রোফাইল ফটো
        const populated = await ResultsModel.populate(performers, {
            path: "_id",
            select: "username profilePhoto",
            model: "AuthAccount",
        });

        res.status(200).json(populated);
    } catch (error) {
        console.log(error)
        serverError(res, error);
    }
};
