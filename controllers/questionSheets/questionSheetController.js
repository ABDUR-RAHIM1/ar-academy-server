import QuestionsSheetModel from "../../models/questionSheets/QuestionSheetsModel.js";



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

        // Create new QuestionsSheet document
        const newSheet = new QuestionsSheetModel({
            classId,
            subjectId,
            chapterId,
            questions
        });

        const savedSheet = await newSheet.save();

        res.status(201).json({
            message: "Questions sheet created successfully",
            data: savedSheet
        });
    } catch (error) {
        console.error("Error creating questions sheet:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// Get all question sheets
export const getAllQuestionsSheets = async (req, res) => {
    try {
        const sheets = await QuestionsSheetModel.find()
            .populate("classId", "name")
            .populate("subjectId", "name")
            .populate("chapterId", "name title");

        res.status(200).json(sheets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get questions sheets by query (filter by classId, subjectId, chapterId)
export const getQuestionsSheetsByQuery = async (req, res) => {
    try {
        const { classId, subjectId, chapterId } = req.query;

        if (!classId && !subjectId && !chapterId) {
            return res.status(400).json({ message: "At least one query parameter required (classId, subjectId or chapterId)" });
        }

        const filter = {};
        if (classId) filter.classId = classId;
        if (subjectId) filter.subjectId = subjectId;
        if (chapterId) filter.chapterId = chapterId;

        const sheets = await QuestionsSheetModel.find(filter)
            .populate("classId", "name")
            .populate("subjectId", "name")
            .populate("chapterId", "name title");

        res.status(200).json(sheets);
    } catch (error) {
        console.error(error);
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