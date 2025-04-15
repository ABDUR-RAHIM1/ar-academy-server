import ResultsModel from "../../models/results/results.model.js";



// POST - Submit Question Paper
export const submitQuestions = async (req, res) => {

    const { results, correctAns, wrongAns, skip, totalQuestions } = req.body;
    const { id } = req.user
    try {

        const newResult = new ResultsModel({
            user: id,
            results,
            correctAns,
            wrongAns,
            skip,
            totalQuestions,
        });

        await newResult.save();

        res.status(201).json({ message: "Question submitted successfully" });

    } catch (error) {
        res.status(500).json({
            message: "Failed to submit question paper",
            error,
        });
    }
};

// GET - Fetch all results ( in dahsboard)
export const getResults = async (req, res) => {
    try {

        const results = await ResultsModel.find()
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
        const myResults = await ResultsModel.find({ user: id });

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
