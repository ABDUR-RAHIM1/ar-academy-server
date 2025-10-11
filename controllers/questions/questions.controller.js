import { roles } from "../../config/constans.js";
import { checkAndUpdatePurchasePlanStatus } from "../../helpers/checkAndUpdatePurchasePlanStatus.js";
import { serverError } from "../../helpers/serverError.js";
import CourseModel from "../../models/courses/courseModel.js";
import QuestionsModel from "../../models/questions/questions.model.js";
import AccountModel from "../../models/accounts/account.model.js";
import mongoose from "mongoose";

// ✅ POST - Create New Questions

// new duel Access (admin , subAdmin)
export const postQuestions = async (req, res) => {
    const { courseId, questionType, subjectName, duration, startDate, startTime, passMark, nagetiveMark, allowRetake, isPublished, questions } = req.body;


    const creator = req.admin || req.subAdmin;


    try {

        const newQuestions = new QuestionsModel(
            {
                course: courseId,
                questionType,
                subjectName,
                duration,
                startDate,
                startTime,
                passMark,
                nagetiveMark,
                allowRetake,
                isPublished,
                questions,
                createdBy: creator.id,
                creatorRole: creator.role
            }
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



// ✅ GET - Fetch All Questions with optionalAuth (middleware)
export const getAllQuestions = async (req, res) => {
    try {
        // Default filter: শুধু published questions
        let filter = {};

        // যদি guest → শুধুমাত্র published
        if (!req.user) {
            filter = { isPublished: true };
        }
        // যদি logged-in normal user
        else if (req.user.role === roles.user) {
            filter = {
                isPublished: true,
                participant: { $nin: [req.user.id] }
            };
        }
        // যদি admin / staff → সব দেখবে, filter empty
        else if (req.user.role === roles.admin) {
            filter = {}; // no filter → all questions
        }

        const questions = await QuestionsModel.find(filter)
            .sort({ createdAt: -1 })
            .populate("course", "name")
            .populate("createdBy", "usernam role")

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

// + <-----------------------  Sub Admin Only get his Questions Start --------------->
export const getSubAdminQuestions = async (req, res) => {
    try {

        const { id } = req.subAdmin;

        const questions = await QuestionsModel.find({
            createdBy: id,
            creatorRole: roles.subAdmin
        })
            .populate("course", "name")

        const formattedQuestions = questions.map((q) => {
            return {
                ...q.toObject(),
                questionsCount: q.questions?.length || 0,
                questions: undefined, // প্রশ্নগুলো না পাঠানোর জন্য
            };
        });

        res.status(200).json(formattedQuestions);

    } catch (error) {
        serverError(res, error)
    }
}


// - <-----------------------  Sub Admin Only get his Questions  End --------------->




// GET - Get Question by questionId (single question for exam)
// export const getQuestionById = async (req, res) => {
//     const { questionId } = req.params;

//     try {
//         // ✅ user logged in check
//         if (!req.user) {
//             return res.status(401).json({
//                 message: "এই প্রশ্নে পরীক্ষা দিতে হলে তোমাকে লগইন করতে হবে।"
//             });
//         }

//         // ✅ প্রথমে role check করবো
//         const { role, id } = req.user;

//         // ✅ প্রশ্ন fetch
//         const question = await QuestionsModel.findById(questionId);
//         if (!question) {
//             return res.status(404).json({ message: "কোন প্রশ্ন পাওয়া যায়নি" });
//         }

//         // ✅ যদি admin হয় → সরাসরি access
//         if (role === roles.admin) {
//             return res.status(200).json(question);
//         }

//         // ✅ যদি user হয় → DB থেকে user খুঁজবো
//         if (role === roles.user) {
//             const user = await AccountModel.findById(id);
//             if (!user) {
//                 return res.status(404).json({ message: "ইউজার পাওয়া যায়নি" });
//             }

//             // ✅ user এর course এর সাথে question.course match check
//             const userHasCourse = user.courses.some(
//                 (c) => c.toString() === question.course.toString()
//             );

//             if (!userHasCourse) {
//                 return res.status(403).json({
//                     message: "তুমি এই কোর্সে এনরোল করোনি, তাই প্রশ্নে প্রবেশ করতে পারবে না।"
//                 });
//             }

//             // সব ঠিক থাকলে return
//             return res.status(200).json(question);
//         }

//         // ✅ অন্য role হলে block করে দিবো
//         return res.status(403).json({ message: "Access denied" });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: "Failed to fetch question",
//             error
//         });
//     }
// };


// ------------------------ getQuestionById Start -----------------------------------
// GET - Get Questions By questions Id (singel Question for Exam - only user)
/*
 -> login user er id diye user check korbe . 
  -> jodi courses thake tahole sei course er moddhe thaka courseId gulo diye questionsId diye (jehetu protita course er Id ace questions gulor moddhe ). 
 -> user pawa gele sei user er course field =[] check kore dekhbe courses filed a kono course kina ace kina.
-> tarpor mile gele questions gulo return korbe 
*/
export const getQuestionById = async (req, res) => {
    try {

        const { questionId } = req.params;
        const { id } = req.user;

        const user = await AccountModel.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "অনুমতি নেই!"
            })
        }

        const question = await QuestionsModel.findOne({
            _id: questionId,
            course: { $in: user.courses.map(id => new mongoose.Types.ObjectId(id)) }
        });



        if (!question) {
            return res.status(403).json({
                message: "এই প্রশ্নে আপনার অনুমতি নেই"
            })
        }

        res.status(200).json(question);


    } catch (error) {
        console.log(error)
        serverError(res, error)
    }
};
// ------------------------ getQuestionById End -----------------------------------





//  get single questions only for Admin
export const getSingleQuestionByAdmin = async (req, res) => {
    const { questionId } = req.params;

    try {

        if (!questionId) {
            return res.status(403).json({
                message: "QuestionId not found"
            })
        }

        // ✅ প্রশ্ন আনো
        const question = await QuestionsModel.findById(questionId);


        if (!question) {
            return res.status(404).json({ message: "কোন প্রশ্ন পাওয়া যায়নি" });
        };

        res.status(200).json(question);

    } catch (error) {
        console.log(error)
        serverError(res, error)
    }
}


// ✅ GET - Get Questions by subjectName filter (partial match)
export const getQuestionByCourseName = async (req, res) => {
    const { subjectName } = req.params; // এটা string হবে

    try {
        // split করে আলাদা আলাদা শব্দ বানাও (যেমন "test one" => ["test", "one"])
        const words = subjectName.split(" ");

        const orConditions = words.map(word => ({
            subjectName: { $regex: word, $options: "i" }
        }));

        let questions = await QuestionsModel.find({
            $or: orConditions,
            isPublished: true
        })
            .populate("course", "name title")
            .select("course questionType subjectName");

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




// ✅ PUT - Update a question by ID - 
// je questions update kora hobe sei questions theke ager participet gulo ke remove kora hobe, jeno user notun questions er feelings pay 
export const updateQuestionById = async (req, res) => {
    const { questionId } = req.params;
    // const { courseId, questionType, subjectName, duration, startDate, startTime, passMark, nagetiveMark, allowRetake, isPublished, questions } = req.body;



    if (!questionId) {
        return res.status(400).json({ message: "Invalid Question ID" });
    }

    try {
        // participant ফিল্ড খালি করে দেওয়া হবে
        const updateData = {
            ...req.body,
            participant: [],
        };


        // যদি questions আসে এবং non-empty হয়, তাহলে updateData তে add করো
        if (Array.isArray(req.body.questions) && req.body.questions.length > 0) {
            updateData.questions = req.body.questions;
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
