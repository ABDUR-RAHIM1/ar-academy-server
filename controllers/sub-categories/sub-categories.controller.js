
import { createSlug } from "../../helpers/createSlug.js"; 
import CategorieModel from "../../models/categories/categoriesModel.js";
import SubjectModel from "../../models/sub-categorie/sub-categorie.model.js";
// SubjectModel === sub-categories


// Create Sub Category
export const createSubCategory = async (req, res) => {
    const { sub_name, description, categorieId, type } = req.body;

    if (!sub_name || !categorieId || !type) {
        return res.status(400).json({ message: "All Fields Are Required!" });
    }

    const slug = createSlug(sub_name);

    try {

        const exists = await SubjectModel.findOne({ identifier: slug });
        if (exists) {
            return res.status(400).json({ message: `${slug} Already Created!` });
        }

        const newSubject = new SubjectModel({
            sub_name,
            identifier: slug,
            description,
            categorieId,
            type
        });

        await newSubject.save();

        return res.status(201).json({ message: "Created Successfully" });

    } catch (error) {

        return res.status(500).json({ message: "Failed To Post" });
    }
};

// Get All Sub Categories
export const getAllSubCategories = async (req, res) => {
    try {

        const sub_categories = await SubjectModel.find();
        return res.status(200).json(sub_categories);
    } catch (error) {
        return res.status(500).json({ message: "Failed To Fetch" });
    }
};



// Get Sub-Categories by Category Identifier
export const getSubCategoriesByCategory = async (req, res) => {
    const { categorieIdentifier } = req.params;


    try {

        const category = await CategorieModel.findOne({
            identifier: { $regex: `^${categorieIdentifier}$`, $options: 'i' },
        });

        if (!category) {
            return res.status(404).json({ message: 'Category Not Found' });
        }

        const subCategories = await SubjectModel.find({ categorieId: category._id });

        return res.status(200).json(subCategories);

    } catch (error) {
        return res.status(500).json({ message: 'Failed To Fetch' });
    }
};

 
// Update Sub Category
export const updateSubCategory = async (req, res) => {
    const { sub_id } = req.params;
    const { sub_name, description, type } = req.body;

    const slug = createSlug(sub_name);

    const updatedBody = {
        sub_name,
        identifier: slug,
        description,
        type
    };

    try {
        const isUpdated = await SubjectModel.findByIdAndUpdate(
            sub_id,
            { $set: updatedBody },
            { new: true, runValidators: true }
        );

        if (!isUpdated) {
            return res.status(404).json({ message: 'Sub Category Not Found' });
        }

        return res.status(200).json({ message: 'Updated' });

    } catch (error) {
        return res.status(500).json({ message: 'Failed To Update' });
    }
};

// Delete Sub Category
export const deleteSubCategory = async (req, res) => {
    const { sub_id } = req.params;


    try {
        const isDeleted = await SubjectModel.findByIdAndDelete(sub_id);

        if (!isDeleted) {
            return res.status(404).json({ message: 'Not Found!' });
        }

        return res.status(200).json({ message: 'Deleted' });

    } catch (error) { 
        return res.status(500).json({ message: 'Failed To Delete' });
    }
};
