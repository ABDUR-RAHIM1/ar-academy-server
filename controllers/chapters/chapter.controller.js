import { createSlug } from "../../helpers/createSlug.js";
import ChaptersModel from "../../models/chapters/chapter.model.js";
import SubjectModel from "../../models/sub-categorie/sub-categorie.model.js";


//  create chapter
export const createChapter = async (req, res) => {
    const { chapter_name, contents, sub_categorie_id, fileType } = req.body;

    if (!chapter_name || !contents || !sub_categorie_id || !fileType) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const slug = createSlug(chapter_name);

    try {

        const exist = await ChaptersModel.findOne({ identifier: slug });
        if (exist) {
            return res.status(400).json({ message: `${chapter_name} is already created.` });
        }



        const newChapter = new ChaptersModel({
            chapter_name,
            identifier: slug,
            contents: fileType === "editor" ? contents : undefined,
            solutionTable: fileType === "file" ? contents : undefined,
            sub_categorie_id,
            fileType
        });

        await newChapter.save();

        res.status(201).json({ message: "Chapter Created Successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Chapter Creation Failed." });
    }
};


// get all chapters
export const getAllChapters = async (req, res) => {
    try {

        const chapters = await ChaptersModel.find().select("-contents");
        res.status(200).json(chapters);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ message: "Failed to fetch chapters." });
    }
};


//  get Chapter By Sub Categorie Identifier
export const getChapterByIdentifier = async (req, res) => {
    const { subIdentifier } = req.params;

    if (!subIdentifier) {
        return res.status(404).json({ message: "Chapter Name Missing!" });
    }

    try {

        const chapter = await ChaptersModel.findOne({
            identifier: { $regex: `^${subIdentifier}$`, $options: "i" },
        });

        if (!chapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }

        res.status(200).json(chapter);
    } catch (error) {
        res.status(500).json({ message: "Chapter Fetch Failed" });
    }
};


// ✅ GET Chapters by SubCategory Identifier (without contents)
export const getChaptersBySubCategoryIdentifier = async (req, res) => {
    const { chapterIdentifier } = req.params;

    if (!chapterIdentifier) {
        return res.status(404).json({ message: "Chapter Identifier Missing!" });
    }

    try {

        const subCategorie = await SubjectModel.findOne({
            identifier: { $regex: `^${chapterIdentifier}$`, $options: "i" },
        });

        if (!subCategorie) {
            return res.status(404).json({ message: "Sub Categorie Not Found!" });
        }

        const sub_id = subCategorie._id;

        const chapters = await ChaptersModel.find({ sub_categorie_id: sub_id }).select("-contents");

        res.status(200).json(chapters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Chapter Fetch Failed" });
    }
};

// ✅ PUT - Update Chapter by ID
export const updateChapter = async (req, res) => {
    const { chapterIdentifier } = req.params; // _id
    const chapterId = chapterIdentifier;
    const { chapter_name, contents, sub_categorie_id, fileType } = req.body;

    if (!chapterId || chapterId === 'undefined') {
        return res.status(400).json({ message: "Invalid chapterId" });
    }

    const slug = createSlug(chapter_name);
    const updatedBody = {
        chapter_name,
        identifier: slug,
        contents,
        sub_categorie_id,
        fileType
    };

    if (Object.keys(updatedBody).length === 0) {
        return res.status(400).json({ message: "No fields to update" });
    }

    try {

        const isUpdate = await ChaptersModel.findByIdAndUpdate(chapterId, {
            $set: updatedBody
        }, { new: true });

        if (!isUpdate) {
            return res.status(404).json({ message: "Chapter not found!" });
        }

        res.status(200).json({ message: "Chapter Updated Successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Chapter Update Failed" });
    }
};





// ✅ DELETE - Delete Chapter by ID
export const deleteChapter = async (req, res) => {
    const { chapterIdentifier } = req.params;
    const chapterId = chapterIdentifier;

    if (!chapterId || chapterId === 'undefined') {
        return res.status(400).json({ message: "Invalid chapterId" });
    }

    try {

        const isDelete = await ChaptersModel.findByIdAndDelete(chapterId);

        if (!isDelete) {
            return res.status(404).json({ message: "Chapter not found!" });
        }

        res.status(200).json({ message: "Chapter Deleted Successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Chapter Delete Failed" });
    }
};
