import QuestionsModel from "../../models/questions/questions.model.js";


// ✅ POST - Create New Questions
export const postQuestions = async (req, res) => {
    const { sub_categorie, questions } = req.body;

    try {
        const newQuestions = new QuestionsModel({
            sub_categorie,
            questions
        });

        await newQuestions.save();

        res.status(201).json({
            message: "Questions added successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to post questions",
            error
        });
    }
};

// ✅ GET - Fetch All Questions
export const getAllQuestions = async (req, res) => {
    try {

        const questions = await QuestionsModel.find()
            .sort({ createdAt: -1 })
            .populate("sub_categorie", "sub_name identifier type");

        res.status(200).json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch questions",
            error
        });
    }
};



// ✅ GET - Get Question by ID
export const getQuestionById = async (req, res) => {
    const { questionId } = req.params;

    try {

        const question = await QuestionsModel.findById(questionId)
            .populate("sub_categorie", "sub_name identifier type");

        if (!question) {
            return res.status(404).json({
                message: "Question not found"
            });
        }

        res.status(200).json(question);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch question",
            error
        });
    }
};


// ✅ PUT - Update a question by ID
export const updateQuestionById = async (req, res) => {
    const { questionId } = req.params;
    const { sub_categorie, questions } = req.body;

    if (!questionId) {
        return res.status(400).json({ message: "Invalid Question ID" });
    }

    try { 

        const updatedQuestion = await QuestionsModel.findByIdAndUpdate(
            questionId,
            {
                $set: {
                    sub_categorie,
                    questions
                }
            },
            { new: true } // return updated document
        );

        if (!updatedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json({
            message: "Question updated successfully"
        });

    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({
            message: "Failed to update question",
            error
        });
    }
};

// ✅ DELETE - Delete Question by ID
export const deleteQuestionById = async (req, res) => {
    const { questionId } = req.params;
    try {

        const isDeleted = await QuestionsModel.findByIdAndDelete(questionId);

        if (!isDeleted) {
            return res.status(404).json({
                message: "Question not found"
            });
        }

        res.status(200).json({
            message: "Question deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete question",
            error
        });
    }
};
