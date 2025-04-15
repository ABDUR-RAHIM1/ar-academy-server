import express from "express";

import { createChapter, deleteChapter, getAllChapters, getChapterByIdentifier, getChaptersBySubCategoryIdentifier, updateChapter, } from "../../controllers/chapters/chapter.controller.js";

const router = express.Router();

//  /api/chapters
router.post("/create", createChapter) // ok
router.get("/all", getAllChapters) // ok 
router.get("/contents/:subIdentifier", getChapterByIdentifier) // ok
// chapterIdentifier hocche sub category identifier (GET only name/description)
router.get("/without-contents/:chapterIdentifier", getChaptersBySubCategoryIdentifier); 
router.put("/update/:chapterIdentifier", updateChapter)  // ok
router.delete("/delete/:chapterIdentifier", deleteChapter) // ok

export default router;
