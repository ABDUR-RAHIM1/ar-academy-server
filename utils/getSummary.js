
import AccountModel from "../models/accounts/account.model.js";
import CategorieModel from "../models/categories/categoriesModel.js";
import ChaptersModel from "../models/chapters/chapter.model.js";
import CommentModel from "../models/comments/comments.model.js";
import PurchasePlanModel from "../models/purchasePlan/purchasePlan.js";
import QuestionsModel from "../models/questions/questions.model.js";
import ResultsModel from "../models/results/results.model.js";
import SubjectModel from "../models/sub-categorie/sub-categorie.model.js";


export const getCourseSummary = async (req, res) => {
    try {
        const categoriesCount = await CategorieModel.countDocuments();
        const subCategoriesCount = await SubjectModel.countDocuments();
        const chaptersCount = await ChaptersModel.countDocuments();
        const questionsCount = await QuestionsModel.countDocuments();
        const jobPostsCount = 50; // pore job post get kore replace korte hbe

        const summary = [
            { name: "Categories", count: categoriesCount },
            { name: "Sub-Categories", count: subCategoriesCount },
            { name: "Chapters", count: chaptersCount },
            { name: "Questions", count: questionsCount },
            { name: "Job Posts", count: jobPostsCount },
        ];
        res.status(200).json(summary);
    } catch (error) {
        console.error('Error fetching summary:', error);
        res.status(500).json({ error: 'Failed to fetch Course summary' });
    }
};

export const getUserSummary = async (req, res) => {
    try {

        const usersCount = await AccountModel.countDocuments();
        const purchasePlanCount = await PurchasePlanModel.countDocuments();
        const resultsCount = await ResultsModel.countDocuments();
        const commentsCount = await CommentModel.countDocuments();

        const summary = [
            { name: "Users", count: usersCount },
            { name: "Purchased", count: purchasePlanCount },
            { name: "Results", count: resultsCount },
            { name: "Comments", count: commentsCount },
        ];

        res.status(200).json(summary);

    } catch (error) {
        console.error('Error fetching summary:', error);
        res.status(500).json({ error: 'Failed to fetch Users summary' });
    }
}