import ChapterListModel from "../../models/questionSheets/ChapterListModel.js";

// multiple chapters added
export const addChapters = async (req, res) => {
  try {
    const { classId, subjectId, chapters } = req.body;

    if (!classId || !subjectId) {
      return res.status(400).json({ message: "classId and subjectId are required" });
    }

    if (!Array.isArray(chapters) || chapters.length === 0) {
      return res.status(400).json({ message: "Please provide an array of chapters" });
    }

    const chaptersWithClassAndSubject = chapters.map((item) => {
      if (!item.name) {
        throw new Error("Each chapter must have a 'name' field");
      }
      return {
        ...item,
        classId,
        subjectId,
      };
    });

    const result = await ChapterListModel.insertMany(chaptersWithClassAndSubject);

    res.status(201).json({
      message: "Chapters added successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get all chapters
export const getAllChapters = async (req, res) => {
  try {
    const allChapters = await ChapterListModel.find()
      .populate("classId", "name")
      .populate("subjectId", "name title");

    res.status(200).json(allChapters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// get chapters by subjectId (query parameter)
export const getChaptersBySubjectId = async (req, res) => {
  try {
    const { subjectId } = req.query;
 
    if (!subjectId) {
      return res.status(400).json({ message: "subjectId is required" });
    }
    const chapters = await ChapterListModel.find({ subjectId })
      .populate("classId", "name")
      .populate("subjectId", "name title");

    res.status(200).json(chapters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// update chapter
export const updateChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;

    const isUpdated = await ChapterListModel.findByIdAndUpdate(chapterId, {
      $set: req.body,
    });

    if (!isUpdated) {
      return res.status(404).json({
        message: "Failed to update Chapter",
      });
    }

    return res.status(200).json({
      message: "Successfully updated",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// delete chapter
export const deleteChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;


    const isDeleted = await ChapterListModel.findByIdAndDelete(chapterId);

    if (!isDeleted) {
      return res.status(404).json({
        message: " Chapter not found",
      });
    }

    return res.status(200).json({
      message: "Successfully deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
