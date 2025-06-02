import QuestionsModel from "../../models/questions/questions.model.js";


// ✅ POST - Create New Questions
export const postQuestions = async (req, res) => {
    const { isAll, isAllTitle, sub_categorie, chapter, questions } = req.body;

    try {

        const newQuestions = new QuestionsModel(
            isAll
                ? { isAll, isAllTitle, questions }
                : { isAll, sub_categorie, chapter, questions }
        );

        await newQuestions.save();

        res.status(201).json({
            message: "Questions added successfully"
        });

    } catch (error) {
        console.error(error);
        if (error.name === "ValidationError") {
            // field-wise errors একটায় সাজানো
            const errors = {};
            Object.keys(error.errors).forEach(field => {
                errors[field] = error.errors[field].message;
            });

            return res.status(400).json({
                message: "Validation Failed",
                errors: errors
            });
        }
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
            .populate("sub_categorie", "sub_name identifier type")
            .populate("chapter", "chapter_name identifier type");

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
            .populate("sub_categorie", "sub_name identifier type")
            .populate("chapter", "chapter_name identifier type");

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

// ✅ GET - Get Question by Chapter ID
export const getQuestionByChapterId = async (req, res) => {
    const { chapterId } = req.params;

    try {

        const question = await QuestionsModel.find({ chapter: chapterId })
            .populate("sub_categorie", "sub_name identifier type")
            .populate("chapter", "chapter_name identifier type");

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


// ✅ GET - Get Questions by isAllTitle filter (partial match)
export const getQuestionByIsAllTitle = async (req, res) => {
    const { isAllTitle } = req.params;

    try {
        // isAllTitle কে শব্দে ভাগ করো
        const words = isAllTitle.split(' ').filter(Boolean);

        // প্রথমে $or দিয়ে সব মিলানো রেকর্ডগুলো নিয়ে আসো
        const orConditions = words.map(word => ({
            isAllTitle: { $regex: word, $options: 'i' }
        }));

        let questions = await QuestionsModel.find({
            $or: orConditions
        })
            .populate("sub_categorie", "sub_name identifier type")
            .populate("chapter", "chapter_name identifier type");

        // এখন JavaScript দিয়ে ফিল্টার করো, যেগুলোর isAllTitle তে কমপক্ষে 2 টা শব্দ আছে
        questions = questions.filter(q => {
            let matchedCount = 0;
            const title = q.isAllTitle.toLowerCase();

            for (const word of words) {
                if (title.includes(word.toLowerCase())) {
                    matchedCount++;
                }
                if (matchedCount >= 2) return true; // 2 বা তার বেশি শব্দ মিললে true
            }
            return false; // ২ এর কম শব্দ মিললে false
        });

        if (questions.length === 0) {
            return res.status(404).json({
                message: "Related questions not found"
            });
        }

        res.status(200).json(questions);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch Related questions",
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
                    chapter,
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
