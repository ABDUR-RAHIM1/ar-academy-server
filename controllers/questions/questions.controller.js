import { checkAndUpdatePurchasePlanStatus } from "../../helpers/checkAndUpdatePurchasePlanStatus.js";
import AccountModel from "../../models/accounts/account.model.js";
import QuestionsModel from "../../models/questions/questions.model.js";


// ✅ POST - Create New Questions
export const postQuestions = async (req, res) => {
    const { isAll, isAllTitle, sub_categorie, chapter, questions, type, duration } = req.body;

    try {

        const newQuestions = new QuestionsModel(
            isAll
                ? { isAll, isAllTitle, questions, type, duration }
                : { isAll, sub_categorie, chapter, questions, type, duration }
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



// ✅ GET - Fetch All Questions with optionalAuth (middlewere) participant
export const getAllQuestions = async (req, res) => {
    try {
        let filter = {};

        // যদি লগইন থাকে, participant ফিল্টার করে দেয়, যাতে ওই ইউজারের অংশগ্রহণকৃত exam বাদ পড়ে
        // শুধুমাত্র user রোল হলে participant ফিল্টার করবে, অন্য রোল হলে সব ডাটা দেখাবে
        if (req.user && req.user.id && req.user.role === "user") {
            filter = { participant: { $ne: req.user.id } };
        }

        const questions = await QuestionsModel.find(filter)
            .sort({ createdAt: -1 })
            .populate("sub_categorie", "sub_name identifier type")
            .populate("chapter", "chapter_name identifier type");

        const formattedQuestions = questions.map((q) => {
            return {
                ...q.toObject(),
                questionsCount: q.questions?.length || 0,
                questions: undefined, // প্রশ্নগুলো না পাঠানোর জন্য
            };
        });

        res.status(200).json(formattedQuestions);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch questions",
            error,
        });
    }
};




// ✅ GET - Get Question by ID by optionalAuth (middlewere) (single questions for exam)
export const getQuestionById = async (req, res) => {
    const { questionId } = req.params;

    try {


        // ✅ যদি ফ্রি হয় বা type না থাকে তাহলে ফ্রি হিসেবেই পাঠাও
        const question = await QuestionsModel.findById(questionId)
            .populate("sub_categorie", "sub_name identifier type")
            .populate("chapter", "chapter_name identifier type");

        if (!question) {
            return res.status(404).json({
                message: "Question not found"
            });
        }


        if (!question.type || question.type === "free") {
            return res.status(200).json(question);
        }

        // ✅ পেইড হলে ইউজার লাগবে 
        if (!req.user) {
            return res.status(401).json({ message: " এই প্রশ্নে পরিক্ষা দিতে হলে তোমাকে লগইন করতে হবে। এবং প্রিমিয়াম প্লান ক্রয় করতে হবে" });
        }

        // ✅ ইউজার ডাটাবেজ থেকে আনো (কারণ req.user এ plan নেই)
        const user = await AccountModel.findById(req.user.id);

        if (!user || !user.plan) {
            return res.status(403).json({
                message: "তুমি কোন প্ল্যান ক্রয় করোনি, প্রিমিয়াম প্ল্যান না থাকলে পেইড প্রশ্নে প্রবেশাধিকার নেই।"
            });
        }

        // ✅ ইউজারের প্ল্যান মেয়াদ শেষ হয়েছে কিনা চেক ও আপডেট করো
        const plan = await checkAndUpdatePurchasePlanStatus(user.plan);

        if (!plan || plan.status !== "active") {
            return res.status(403).json({ message: "এই প্রশ্নে পরিক্ষা দিতে হলে তোমাকে প্ল্যান ক্রয় করতে হবে।" });
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
    const { isAll, isAllTitle, sub_categorie, chapter, questions, type, duration } = req.body;

    if (!questionId) {
        return res.status(400).json({ message: "Invalid Question ID" });
    }

    try {
        // participant ফিল্ড খালি করে দেওয়া হবে
        const updateData = isAll
            ? { isAll, isAllTitle, type, participant: [], duration }
            : { isAll, sub_categorie, chapter, type, participant: [], duration };


        // যদি questions আসে এবং non-empty হয়, তাহলে updateData তে add করো
        if (Array.isArray(questions) && questions.length > 0) {
            updateData.questions = questions;
        }

        const updatedQuestion = await QuestionsModel.findByIdAndUpdate(
            questionId,
            { $set: updateData },
            { new: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json({
            message: "Question updated successfully",
            updatedQuestion,
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
