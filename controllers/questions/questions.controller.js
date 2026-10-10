import { roles } from "../../config/constans.js";
import { serverError } from "../../helpers/serverError.js";
import QuestionsModel from "../../models/questions/questions.model.js";
import AccountModel from "../../models/accounts/account.model.js";
import mongoose from "mongoose";
import PurchaseCourseModel from "../../models/purchaseCourse/purchaseCourse.js";


// export const postQuestions = async (req, res) => {
//     const { courseId, questionType, subjectName, duration, startDate, startTime, passMark, nagetiveMark, allowRetake, isPublished, questions } = req.body;


//     const creator = req.admin || req.subAdmin;


//     try {

//         if (!questionType || !questions) {
//             return res.status(400).json({ message: "questionType and questions are required" });
//         };


//         let newQuestions = new QuestionsModel(
//             {
//                 course: courseId,
//                 questionType,
//                 subjectName,
//                 duration,
//                 startDate,
//                 startTime,
//                 passMark,
//                 nagetiveMark,
//                 allowRetake,
//                 isPublished,
//                 questions,
//                 createdBy: creator.id,
//                 creatorRole: creator.role
//             }
//         );
//         const errors = [];



//         // Conditional validation
//         if (questionType === "mcq") {
//             // check MCQ-specific fields
//             // const invalid = questions.some(q => !q.Option1 || !q.Option2 || !q.Option3 || !q.Option4 || !q.CorrectAnswer || !q.Subject);

//             questions.forEach((q, index) => {
//                 const missingFields = [];
//                 const isEmpty = v => v == null || (typeof v === "string" && !v.trim());

//                 if (isEmpty(q.Option1)) missingFields.push("Option1");
//                 if (isEmpty(q.Option2)) missingFields.push("Option2");
//                 if (isEmpty(q.Option3)) missingFields.push("Option3");
//                 if (isEmpty(q.Option4)) missingFields.push("Option4");
//                 if (isEmpty(q.CorrectAnswer)) missingFields.push("CorrectAnswer");
//                 if (isEmpty(q.Subject)) missingFields.push("Subject");

//                 if (missingFields.length > 0) {
//                     errors.push({
//                         row: index + 1,
//                         missingFields
//                     });
//                 }
//             });



//             if (errors.length > 0) {
//                 return res.status(400).json({
//                     message: "MCQ questions missing fields",
//                     errors
//                 });
//             }

//             newQuestions.questions = questions;


//         } else if (questionType === "written") {
//             // check Written-specific fields
//             const invalid = questions.some(q => !q.Question || !q.Subject);

//             if (invalid) {
//                 return res.status(400).json({ message: "Written questions missing Question field" });
//             };

//             const writtenQuestions = questions.map((q) => ({
//                 ID: q.ID,
//                 Question: q.Question,
//                 CorrectAnswer: "",
//                 Subject: q.Subject
//             }));

//             newQuestions.questions = writtenQuestions;

//         };


//         await newQuestions.save();

//         res.status(201).json({
//             message: "Questions added successfully"
//         });

//     } catch (error) {
//         if (error.name === "ValidationError") {
//             // field-wise errors একটায় সাজানো
//             const errors = {};
//             Object.keys(error.errors).forEach(field => {
//                 errors[field] = error.errors[field].message;
//             });

//             return res.status(400).json({
//                 message: "Validation Failed",
//                 errors: errors
//             });
//         }
//         res.status(500).json({
//             message: "Failed to post questions",
//             error
//         });
//     }
// };





// + <----------------  get all questions for admin / moderator Start -------------> 

//  ata suhdu matro admin / moderator er jonno
// jekhae subAdmin er questions gulo bade baki sob access pabe admin o moderator. 
// ✅ শুধুমাত্র admin এর জন্য: subAdmin দ্বারা তৈরি প্রশ্ন বাদে সব প্রশ্ন দেখাবে


export const postQuestions = async (req, res) => {
    // 1. req.body theke examType ebong dayOffset destructure kore nite hbe
    const {
        courseId,
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
        examType,    // <-- Notun add kora holo
        dayOffset    // <-- Notun add kora holo
    } = req.body;

    const creator = req.admin || req.subAdmin;

    try {
        if (!questionType || !questions) {
            return res.status(400).json({ message: "questionType and questions are required" });
        };

        // 2. QuestionsModel-e examType ebong dayOffset pass kore dite hbe
        let newQuestions = new QuestionsModel(
            {
                course: courseId,
                questionType,
                subjectName,
                duration,
                examType: examType || "live", // Jodi client theke na ashe default "live" thakbe
                dayOffset: dayOffset || 0,     // Default 0 thakbe
                startDate: examType === "live" ? startDate : undefined, // Sudhu live holei date save hbe
                startTime: examType === "live" || examType === "admission_based" ? startTime : undefined, // Sudhu live holei time save hbe
                passMark,
                nagetiveMark,
                allowRetake,
                isPublished,
                questions,
                createdBy: creator.id,
                creatorRole: creator.role
            }
        );



        const errors = [];

        // MCQ validation logic (ager motoi thakbe)
        if (questionType === "mcq") {
            questions.forEach((q, index) => {
                const missingFields = [];
                const isEmpty = v => v == null || (typeof v === "string" && !v.trim());

                if (isEmpty(q.Option1)) missingFields.push("Option1");
                if (isEmpty(q.Option2)) missingFields.push("Option2");
                if (isEmpty(q.Option3)) missingFields.push("Option3");
                if (isEmpty(q.Option4)) missingFields.push("Option4");
                if (isEmpty(q.CorrectAnswer)) missingFields.push("CorrectAnswer");
                if (isEmpty(q.Subject)) missingFields.push("Subject");

                if (missingFields.length > 0) {
                    errors.push({
                        row: index + 1,
                        missingFields
                    });
                }
            });

            if (errors.length > 0) {
                return res.status(400).json({
                    message: "MCQ questions missing fields",
                    errors
                });
            }

            newQuestions.questions = questions;

        } else if (questionType === "written") {
            const invalid = questions.some(q => !q.Question || !q.Subject);

            if (invalid) {
                return res.status(400).json({ message: "Written questions missing Question field" });
            };

            const writtenQuestions = questions.map((q) => ({
                ID: q.ID,
                Question: q.Question,
                CorrectAnswer: "",
                Subject: q.Subject
            }));

            newQuestions.questions = writtenQuestions;
        };

        await newQuestions.save();

        res.status(201).json({
            message: "Questions added successfully"
        });

    } catch (error) {
        if (error.name === "ValidationError") {
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




export const getAllQuestions = async (req, res) => {
    try {
        const token = req.admin;

        // 🧩 শুধু admin এর জন্য permission চেক
        if (!token || token.role !== roles.admin) {
            return res.status(403).json({
                message: "আপনার এই রুটে প্রবেশের অনুমতি নেই।",
            });
        }

        // 🔹 subAdmin দ্বারা তৈরি প্রশ্ন বাদ দিয়ে সব প্রশ্ন আনবে
        const questions = await QuestionsModel.find({
            creatorRole: { $ne: "subAdmin" },
        })
            .sort({ createdAt: -1 })
            .populate("course", "name")
            .populate("createdBy", "username role")


        const formattedQuestions = questions.map((q) => {
            return {
                ...q.toObject(),
                questionsCount: q.questions?.length || 0,
                questions: undefined,
            };
        });

        res.status(200).json(formattedQuestions);

    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({
            message: "Failed to fetch questions",
            error: error.message,
        });
    }
};
// - <----------------  get all questions for admin / moderator End -------------> 


// + < working --- user er course purchsae koreche sei course er questins get korbe Start  -->
//              user je course purchse korbe suhdu sei questions guilo dekhabe 

// export const getStudentCourseQuestions = async (req, res) => {

//     try {
//         const { id } = req.user;          // লগইন করা শিক্ষার্থীর আইডি
//         const { courseId } = req.params;  // URL থেকে কোর্স আইডি

//         // 1️⃣ শিক্ষার্থী খুঁজে বের করা
//         const student = await AccountModel.findById(id);

//         if (!student) {
//             return res.status(404).json({
//                 message: "কোন শিক্ষার্থী পাওয়া যায়নি"
//             });
//         }

//         // 2️⃣ শিক্ষার্থীর course তালিকা থেকে যাচাই করা
//         const studentCourses = student.courses || [];

//         // যদি কোর্সে ভর্তি না থাকে
//         if (!studentCourses.includes(courseId)) {
//             return res.status(403).json({
//                 message: "আপনি এই কোর্সে ভর্তি নন"
//             });
//         }

//         // 3️⃣ প্রশ্নগুলো বের করা (শুধু এই course এর)
//         const questions = await QuestionsModel.find({
//             course: courseId,
//             participant: { $nin: [id] }
//         })
//             // .sort({ createdAt: -1 })
//             .sort({ startDate: 1 })
//             .populate("course", "name")
//             .populate("createdBy", "username role");

//         // 4️⃣ প্রয়োজনে structure সুন্দর করে ফরম্যাট করা
//         const formattedQuestions = questions.map((q) => ({
//             ...q.toObject(),
//             questionsCount: q.questions?.length || 0,
//             questions: undefined,
//         }));

//         // MCQ questions
//         const mcq = formattedQuestions.filter(q => q.questionType === "mcq");

//         // Written questions
//         const written = formattedQuestions.filter(q => q.questionType === "written");

//         res.status(200).json({
//             mcq,
//             written
//         });


//     } catch (error) {
//         console.log(error)
//         serverError(res, error);
//     }
// };

export const getStudentCourseQuestions = async (req, res) => {
    try {
        const { id } = req.user;          // লগইন করা শিক্ষার্থীর আইডি
        const { courseId } = req.params;  // URL থেকে কোর্স আইডি

        // 1️⃣ শিক্ষার্থী খুঁজে বের করা
        const student = await AccountModel.findById(id);

        if (!student) {
            return res.status(404).json({
                message: "কোন শিক্ষার্থী পাওয়া যায়নি"
            });
        }

        // 2️⃣ শিক্ষার্থীর course তালিকা থেকে যাচাই করা
        const studentCourses = student.courses || [];

        // যদি কোর্সে ভর্তি না থাকে
        if (!studentCourses.includes(courseId)) {
            return res.status(403).json({
                message: "আপনি এই কোর্সে ভর্তি নন"
            });
        };


        const purchaseInfo = await PurchaseCourseModel.findOne({ student: id, course: courseId });

        // যদি কোর্সে ভর্তি না থাকে
        if (!purchaseInfo) {
            return res.status(403).json({
                message: "আপনি এই কোর্সে ভর্তি নন"
            });
        };


        // নির্দিষ্ট কোর্সের সমস্ত প্রশ্ন (যা শিক্ষার্থী এখনো অংশগ্রহণ করেনি) ফেচ করা
        const questions = await QuestionsModel.find({
            course: courseId,
            participant: { $nin: [id] }
        })
            .populate("course", "name")
            .populate("createdBy", "username role");




        // 3️⃣ প্রতিটি এক্সামের জন্য ডাইনামিক ডেট ক্যালকুলেশন (Live, Admission-based, Practice)
        // শিক্ষার্থীর এনরোলমেন্ট ডেট বের করা (আপনার স্কিমা অনুযায়ী ফিল্ডের নাম অ্যাডজাস্ট করে নিতে পারেন, যেমন: student.enrolledAt বা course-wise enrollment)
        // ধরি student.enrolledAt এ পুরো কোর্সের এনরোলমেন্ট ডেট আছে, অথবা যদি অবজেক্ট হয় তবে student.enrolledDates.get(courseId) হতে পারে।

        // 3️⃣ প্রতিটি এক্সামের জন্য ডাইনামিক ডেট ও টাইম ক্যালকুলেশন
        const studentEnrollmentDate = new Date(purchaseInfo.activatedAt || purchaseInfo.createdAt);

        const processedQuestions = questions.map((q) => {
            let effectiveStartDate = q.startDate;
            let effectiveStartTime = q.startTime;

            if (q.examType === "admission_based") {
                // const examCreationDate = new Date(q.createdAt);
                const examCreationDate = new Date(studentEnrollmentDate);

                // বেস ডেট নির্ধারণ
                const baseDate = studentEnrollmentDate > examCreationDate ? studentEnrollmentDate : examCreationDate;

                // dayOffset যোগ করা
                const calculatedDate = new Date(baseDate);
                calculatedDate.setDate(baseDate.getDate() + (q.dayOffset || 0));

                effectiveStartDate = calculatedDate;
                // admission_based পরীক্ষার জন্য অ্যাডমিনের দেওয়া startTime বহাল থাকবে
            }
            else if (q.examType === "practice") {
                // প্র্যাকটিস পরীক্ষার জন্য ডেট এবং টাইম দুটোই null করে দেওয়া হলো
                effectiveStartDate = null;
                effectiveStartTime = null;
            }

            return {
                ...q.toObject(),
                startDate: effectiveStartDate, // ক্যালকুলেট করা বা নাল ডেট
                startTime: effectiveStartTime, // ক্যালকুলেট করা বা নাল টাইম
                questionsCount: q.questions?.length || 0,
                questions: undefined,
            };
        });

        // 4️⃣ ক্যালকুলেটেড ডেট অনুযায়ী সর্টিং করা (তারিখের ক্রমানুসারে সাজানো)
        processedQuestions.sort((a, b) => {
            if (!a.startDate) return 1;  // Practice exam গুলো শেষে পাঠাতে পারেন
            if (!b.startDate) return -1;
            return new Date(a.startDate) - new Date(b.startDate);
        });

        // MCQ questions
        const mcq = processedQuestions.filter(q => q.questionType === "mcq");

        // Written questions
        const written = processedQuestions.filter(q => q.questionType === "written");

        res.status(200).json({
            mcq,
            written
        });

    } catch (error) {
        console.log(error);
        serverError(res, error);
    }
};

// - < --- user er course purchsae koreche sei course er questins get korbe End ---->


// - <- -------- free/ practice questions gulo dekha jabe sob gulo -----------------------> 

export const getAllPracticeExams = async (req, res) => {
    try {
        // ডাটাবেজ থেকে সরাসরি সব 'practice' টাইপের পাবলিশড প্রশ্নগুলো বের করা
        const questions = await QuestionsModel.find({
            examType: "practice",
            isPublished: true
        })
            .sort({ createdAt: -1 })
            .populate("course", "name")
            .populate("createdBy", "username role");



        // শুধু MCQ গুলো ফিল্টার করা
        const mcq = questions.filter(q => q.questionType === "mcq");
        // const written = questions.filter(q => q.questionType === "written");

        // সরাসরি শুধু mcq অ্যারে রিটার্ন করা হলো (কোনো length বা extra object নেই)
        res.status(200).json(mcq);

    } catch (error) {
        console.log(error);
        serverError(res, error);
    }
};

// - <- -------- (End) free/ practice questions gulo dekha jabe sob gulo -----------------------> 


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
                questions: undefined,
            };
        });

        res.status(200).json(formattedQuestions);

    } catch (error) {
        serverError(res, error)
    }
};
// - <-----------------------  Sub Admin Only get his Questions  End --------------->





// ---------------- getQuestionById Start (for Exam Details)  -----------------------------------
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
// Ata Use Kora hocce na Ekhn. 
export const getQuestionByCourseName = async (req, res) => {
    const { subjectName } = req.params;

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
// je questions update kora hobe sei questions theke ager participet gulo ke remove kora hobe, jeno user notun questions er feelings pay.
// ai controoller admin o subAdmin er jonno alada router a  use hobe, tai ekhane conditionaly token get kore update kora  holo.
export const updateQuestionById = async (req, res) => {
    const { questionId } = req.params;
    const token = req.admin || req.subAdmin;


    if (!questionId) {
        return res.status(400).json({ message: "Invalid Question ID" });
    }

    try {

        //  ke create koreche seta check kora holo
        const question = await QuestionsModel.findOne({
            _id: questionId,
            createdBy: token.id,
            creatorRole: token.role
        });

        if (!question) {
            return res.status(404).json({
                message: "আপনার অনুমতি নেই"
            })
        }



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

    try {
        const { questionId } = req.params;
        const token = req.admin || req.subAdmin;

        if (!questionId) {
            return res.status(400).json({ message: "Invalid Question ID" });
        }


        //  ke delete korte parbe  seta check kora holo
        const question = await QuestionsModel.findOne({
            _id: questionId,
            createdBy: token.id,
            creatorRole: token.role
        });

        if (!question) {
            return res.status(404).json({
                message: "আপনার অনুমতি নেই"
            })
        }





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
