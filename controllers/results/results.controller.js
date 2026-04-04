import AccountModel from "../../models/accounts/account.model.js";
import QuestionsModel from "../../models/questions/questions.model.js";
import ResultsModel from "../../models/results/results.model.js";



// POST - Submit Question Paper
export const submitQuestions = async (req, res) => {

    const { examType, question: questionId, results, correctAns, wrongAns, skip, totalmark, nagetiveMark, passMark, isPass, isRetake, totalQuestions } = req.body;
    const { id } = req.user


    try {


        // ✅ Check if user already participated
        const exam = await QuestionsModel.findById(questionId);

        if (!exam) {
            return res.status(404).json({ message: "পরিক্ষা খুজে পাওয়া যায়নি" });
        }

        const alreadyParticipated = exam.participant?.includes(id);

        if (alreadyParticipated) {
            return res.status(400).json({ message: "তুমি পরীক্ষাটি একবার দিয়ে ফেলেছ!" });
        }

        // ==   MCQ or Written 
        let resultPublishedStatus = examType === "mcq" ? true : false;

        const newResult = new ResultsModel({
            user: id,
            question: questionId,
            results,
            correctAns,
            wrongAns,
            skip,
            totalmark,
            nagetiveMark,
            passMark,
            isPass,
            isRetake,
            totalQuestions,
            isPublished: resultPublishedStatus
        });

        await newResult.save();

        // update participant list
        await QuestionsModel.findByIdAndUpdate(
            questionId,
            { $push: { participant: id } },
            { new: true }
        );

        res.status(201).json({ message: "সফল ভাবে জমা দেওয়া হয়েছে" });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "পরিক্ষা জমা দিতে বার্থ হয়েছে!",
            error,
        });
    }
};

// GET - Fetch all results ( in admin dahsboard)
export const getResults = async (req, res) => {
    try {

        const results = await ResultsModel.find()
            .sort({ createdAt: -1 })
            .select("-results")
            .populate("user", "username email")
            .populate("question", "subjectName questionType");

        res.status(200).json(results);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch question papers",
            error,
        });
    }
};


// GET - Fetch all results (in  subAdmin dashboard)
export const getResultsBySubAdmin = async (req, res) => {
    try {
        const { id } = req.subAdmin;

        // Step 1: Find students under this subAdmin
        const students = await AccountModel.find({ owner: id }).select("_id");

        // Step 2: Extract only student IDs
        const studentIds = students.map((student) => student._id);

        // Step 3: Fetch results for those students only
        const results = await ResultsModel.find({ user: { $in: studentIds } })
            .sort({ createdAt: -1 })
            .select("-results")
            .populate("user", "username email")
            .populate("question", "subjectName questionType");

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch result sheets",
            error,
        });
    }
};



//  fetch  result for specpic user ( user profile )
export const getMyResults = async (req, res) => {
    const { id } = req.user;
    try {
        const myResults = await ResultsModel.find({ user: id, isPublished: true })
            .sort({ createdAt: -1 })
            .select("-results")
            .populate("question", "subjectName questionType");
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
        const result = await ResultsModel.findById(resultId)
            .populate("user", "username email")
            .populate("question", "subjectName questionType  duration passMark")

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

//  <==============   Written Exam  Result Published By Admin (Beloew) =============> 

export const publishedWrittenResult = async (req, res) => {
    try {
        const { resultId } = req.params;
        const marks = req.body;

        const role = req?.admin || req?.subAdmin


        const result = await ResultsModel.findById(resultId);

        if (!result) {
            return res.status(404).json({
                message: 'Result Not Found!'
            });
        }

        // ম্যাপ করে প্রাপ্ত নম্বর আপডেট করা
        const updatedResults = result.results.map(item => {
            if (marks[item.id] !== undefined) {

                return {
                    ...item.toObject ? item.toObject() : item,
                    obtainMarks: Number(marks[item.id])
                };
            }
            return item;
        });


        const totalObtainedMarks = updatedResults.reduce((acc, curr) => acc + (Number(curr.obtainMarks) || 0), 0);

        result.results = updatedResults;
        result.totalmark = totalObtainedMarks;
        result.isPublished = true;


        result.isPass = totalObtainedMarks >= result.passMark;


        // console.log(totalObtainedMarks, result.isPass, result.passMark, result.totalmark)
       

        await result.save();

        return res.status(200).json({
            message: "Result Has been Published",
        });

    } catch (error) {
        console.error("Publish Error:", error);
        res.status(500).json({
            message: "Failed to Published Result"
        });
    }
}

//  <==============   Written Exam  Result Published By Admin (Above) ==============> 