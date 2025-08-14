
import express from "express";
import { addClassList, deleteClassList, getAllClassList, updateClassList } from "../../controllers/questionSheets/classListController.js";
import { addSubjectList, deleteSubjectList, getAllSubjectList, getSubjectByQuery, updateSubjectList } from "../../controllers/questionSheets/subjectListController.js";
import { addChapters, deleteChapter, getAllChapters, getChaptersBySubjectId, updateChapter } from "../../controllers/questionSheets/chapterListController.js";
import { addQuestionsSheet, deleteQuestionsSheet, getAllQuestionsSheets, getQuestionsSheetsByQuery, updateQuestionsSheet } from "../../controllers/questionSheets/questionSheetController.js";

const router = express.Router();

router.post("/classList/create", addClassList)
router.get("/classList/get-all", getAllClassList)
router.put("/classList/update/:classId", updateClassList)
router.delete("/classList/delete/:classId", deleteClassList)




//  subject router
router.post("/subjectList/create", addSubjectList);
router.get("/subjectList/get-all", getAllSubjectList);
router.get("/subjectList/getByQuery", getSubjectByQuery) // search filter
router.put("/subjectList/update/:subjectId", updateSubjectList);
router.delete("/subjectList/delete/:subjectId", deleteSubjectList);




//  Chapter router
router.post("/chapterList/create", addChapters);
router.get("/chapterList/get-all", getAllChapters);
router.get("/chapterList/getByQuery", getChaptersBySubjectId) // search filter
router.put("/chapterList/update/:chapterId", updateChapter);
router.delete("/chapterList/delete/:chapterId", deleteChapter);


//  Question Sheet
router.post("/questionSheet/create", addQuestionsSheet);
router.get("/questionSheet/get-all", getAllQuestionsSheets);
router.get("/questionSheet/getByQuery", getQuestionsSheetsByQuery) // search filter
router.put("/questionSheet/update/:subjectId", updateQuestionsSheet);
router.delete("/questionSheet/delete/:subjectId", deleteQuestionsSheet);



export default router; 