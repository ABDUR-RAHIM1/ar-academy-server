import QuestionsModel from "../../models/questions/questions.model.js";
import ResultsModel from "../../models/results/results.model.js";



// POST - Submit Question Paper
export const submitQuestions = async (req, res) => {

    const { examInfo, results, correctAns, wrongAns, skip, totalQuestions } = req.body;
    const { id } = req.user
    try {


        // ✅ Check if user already participated
        const exam = await QuestionsModel.findById(examInfo.questionId);

        if (!exam) {
            return res.status(404).json({ message: "পরিক্ষা খুজে পাওয়া যায়নি" });
        }

        const alreadyParticipated = exam.participant?.includes(id);

        if (alreadyParticipated) {
            return res.status(400).json({ message: "তুমি পরীক্ষাটি একবার দিয়ে ফেলেছ!" });
        }

        const newResult = new ResultsModel({
            user: id,
            examInfo,
            results,
            correctAns,
            wrongAns,
            skip,
            totalQuestions,
        });

        await newResult.save();

        // update participant list
        await QuestionsModel.findByIdAndUpdate(
            examInfo.questionId,
            { $push: { participant: id } },
            { new: true }
        );

        res.status(201).json({ message: "সফল ভাবে জমা দিয়েছো" });

    } catch (error) {
        res.status(500).json({
            message: "পরিক্ষা জমা দিতে বার্থ হয়েছে!",
            error,
        });
    }
};

// GET - Fetch all results ( in dahsboard)
export const getResults = async (req, res) => {
    try {

        const results = await ResultsModel.find()
            .sort({ createdAt: -1 })
            .populate("user", "username email");

        res.status(200).json(results);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch question papers",
            error,
        });
    }
};


//  fetch  result for specpic user ( user profile )
export const getMyResults = async (req, res) => {
    const { id } = req.user;
    try {
        const myResults = await ResultsModel.find({ user: id })
            .sort({ createdAt: -1 })

        res.status(200).json(myResults);

    } catch (error) {
        res.status(500).json({
            message: "Failed to Fetch Result Sheet",
            error,
        });
    }
};


// resutl details by Id
export const getResultById = async (req, res) => {
    const { resultId } = req.params;

    try {
        const result = await ResultsModel.findById(resultId).populate("user", "username email");

        if (!result) {
            return res.status(404).json({ message: "Result not found" });
        }

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({
            message: "Failed to Fetch Question Paper",
            error,
            token: false
        });
    }
};
