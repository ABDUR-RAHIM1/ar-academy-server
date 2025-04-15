import express from 'express';
import { createSubCategory, deleteSubCategory, getAllSubCategories, getSubCategoriesByCategory, updateSubCategory } from '../../controllers/sub-categories/sub-categories.controller.js';

const router = express.Router();

//  /api/sub-categories
router.post('/create', createSubCategory);
router.get('/all', getAllSubCategories);
router.get('/by-category/:categorieIdentifier', getSubCategoriesByCategory);
 
router.put('/update/:sub_id', updateSubCategory);
router.delete('/delete/:sub_id', deleteSubCategory);


export default router;
