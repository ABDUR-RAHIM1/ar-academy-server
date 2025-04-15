import express from "express";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../../controllers/categories/categories.controller.js";

const router = express.Router();

// /api/categories/
router.post("/create", createCategory);
router.get("/all", getCategories);
router.put("/update/:categorieId", updateCategory);
router.delete("/delete/:categorieId", deleteCategory);

export default router;
