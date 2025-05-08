
import { createSlug } from "../../helpers/createSlug.js";
import { serverError } from "../../helpers/serverError.js";
import CategorieModel from "../../models/categories/categoriesModel.js";

export const createCategory = async (req, res) => {
    const { position, categorie, description } = req.body;
    const slug = createSlug(categorie);

    try {

        const exist = await CategorieModel.findOne({ identifier: slug });
        if (exist) {
            return res.status(400).json({ message: `${slug} Already Created!` });
        }

        const newCategorie = new CategorieModel({
            position,
            categorie,
            identifier: slug,
            description,
        });

        await newCategorie.save();

        return res.status(201).json({ message: "Successfully Created" });

    } catch (error) {
        return serverError(res, error)
    }
};

export const getCategories = async (req, res) => {
    try {

        const categories = await CategorieModel.find().sort({ position: 1, _id: 1 });

        return res.status(200).json(categories);
    } catch (error) {
        return serverError(res, error)
    }
};

// ✅ PUT: Update Category
export const updateCategory = async (req, res) => {
    const { categorieId } = req.params;
    const { position, categorie, description } = req.body;

    if (!categorieId) {
        return res.status(404).json({ message: "Category ID is required" });
    }

    const slug = createSlug(categorie);
    const updatedData = {
        position,
        categorie,
        identifier: slug,
        description,
    };

    try {
      
        const updated = await CategorieModel.findByIdAndUpdate(
            categorieId,
            { $set: updatedData },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Category Not Found" });
        }

        return res.status(200).json({ message: "Successfully Updated" });
    } catch (error) {
        return res.status(500).json({ message: "Failed To Update", error: error?.message });
    }
};

// ✅ DELETE: Delete Category
export const deleteCategory = async (req, res) => {
    const { categorieId } = req.params;

    if (!categorieId) {
        return res.status(404).json({ message: "Category ID is required" });
    }

    try {
       
        const deleted = await CategorieModel.findByIdAndDelete(categorieId);

        if (!deleted) {
            return res.status(404).json({ message: "Category Not Found" });
        }

        return res.status(200).json({ message: "Successfully Deleted" });
    } catch (error) {
        
        return res.status(500).json({ message: "Failed To Delete", error: error?.message });
    }
};