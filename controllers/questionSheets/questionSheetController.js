import QuestionsSheetModel from "../../models/questionSheets/QuestionSheetsModel.js";



// export const addQuestionsSheet = async (req, res) => {
//     try {
//         const { classId, subjectId, chapterId, questions } = req.body;

//         // Validation
//         if (!classId || !subjectId || !chapterId) {
//             return res.status(400).json({ message: "classId, subjectId and chapterId are required" });
//         }

//         if (!Array.isArray(questions) || questions.length === 0) {
//             return res.status(400).json({ message: "Questions array is required and cannot be empty" });
//         }

//         // Create new QuestionsSheet document
//         const newSheet = new QuestionsSheetModel({
//             classId,
//             subjectId,
//             chapterId,
//             questions
//         });

//         const savedSheet = await newSheet.save();

//         res.status(201).json({
//             message: "Questions sheet created successfully",
//             data: savedSheet
//         });
//     } catch (error) {
//         console.error("Error creating questions sheet:", error);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };




// Get all question sheets info (without questions List) for Dashboard 


//  get all questinos overview withou questions Lists
export const getAllQuestionsSheets = async (req, res) => {
    // Get all question sheets info (without questions List) for Dashboard 
    try {
        const sheets = await QuestionsSheetModel.find()
            .select("classId subjectId chapterId questions") // questions রাখবো কিন্তু শুধু length বের করার জন্য
            .populate("classId", "name")
            .populate("subjectId", "name")
            .populate("chapterId", "name title")
            .lean(); // plain JS object ফেরত পাবে

        // এখন questions array বাদ দিয়ে শুধু count পাঠাবো
        const formattedSheets = sheets.map(sheet => ({
            ...sheet,
            questionsCount: sheet.questions?.length || 0,
            questions: undefined // পুরো array বাদ
        }));

        res.status(200).json(formattedSheets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const addQuestionsSheet = async (req, res) => {
    try {
        const { classId, subjectId, chapterId, questions } = req.body;

        // Validation
        if (!classId || !subjectId || !chapterId) {
            return res.status(400).json({ message: "classId, subjectId and chapterId are required" });
        }

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ message: "Questions array is required and cannot be empty" });
        }

        // Check if sheet already exists for this chapter
        let sheet = await QuestionsSheetModel.findOne({ chapterId });

        if (!sheet) {
            // New sheet create
            sheet = new QuestionsSheetModel({
                classId,
                subjectId,
                chapterId,
                questions
            });
        } else {
            // Existing sheet এ নতুন questions push করো
            sheet.questions.push(...questions);
        }

        const savedSheet = await sheet.save();

        res.status(201).json({
            message: sheet.isNew
                ? "নতুন প্রশ্নপত্র সফলভাবে তৈরি হয়েছে"
                : "প্রশ্নগুলো বিদ্যমান শীটে যোগ হয়েছে",
            data: savedSheet
        });
    } catch (error) {
        console.error("Error creating questions sheet:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};




//  get single questionSheet by _id
export const getQuestionSheetById = async (req, res) => {
    try {

        const { qSheetId } = req.params;

        const questionsSheet = await QuestionsSheetModel.findById(qSheetId)
            .populate("classId", "name")
            .populate("subjectId", "name")
            .populate("chapterId", "name title")
            .lean();


        if (!questionsSheet) {
            return res.status(404).json({
                message: "প্রস্নপত্র খুজে পাওয়া যায়নি"
            })
        };

        res.status(200).json(questionsSheet)


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


// Get questions sheets by query (filter by classId, subjectId, chapterId)
export const getQuestionsSheetsByQuery = async (req, res) => {
  try {
    const { classId, subjectId, chapterId } = req.query;

    if (!classId && !subjectId && !chapterId) {
      return res.status(400).json({
        message:
          "কমপক্ষে একটি query parameter দিতে হবে (classId, subjectId অথবা chapterId)",
      });
    }

    const filter = {};
    if (classId) filter.classId = classId;
    if (subjectId) filter.subjectId = subjectId;
    if (chapterId) filter.chapterId = chapterId;

    // findOne ব্যবহার করা হচ্ছে
    const sheet = await QuestionsSheetModel.findOne(filter)
      .populate("classId", "name")
      .populate("subjectId", "name")
      .populate("chapterId", "name title");

    if (!sheet) {
      return res.status(404).json({ message: "কোন প্রশ্নপত্র পাওয়া যায়নি" });
    }

    res.status(200).json(sheet);
  } catch (error) {
    console.error("Error fetching sheet:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Update questions sheet by id
export const updateQuestionsSheet = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedSheet = await QuestionsSheetModel.findByIdAndUpdate(id, { $set: req.body }, { new: true });

        if (!updatedSheet) {
            return res.status(404).json({ message: "Questions sheet not found" });
        }

        res.status(200).json({ message: "Questions sheet updated successfully", data: updatedSheet });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete questions sheet by id
export const deleteQuestionsSheet = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedSheet = await QuestionsSheetModel.findByIdAndDelete(id);

        if (!deletedSheet) {
            return res.status(404).json({ message: "Questions sheet not found" });
        }

        res.status(200).json({ message: "Questions sheet deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};