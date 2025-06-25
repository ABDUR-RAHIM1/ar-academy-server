// import { serverError } from "../../helpers/serverError.js"
// import ChaptersModel from "../../models/chapters/chapter.model.js";
// import QuestionsModel from "../../models/questions/questions.model.js";

// export const getMergedQuestions = async (req, res) => {

//     const { search = "" } = req.query;


//     try {

//         if (!search) {
//             return res.status(400).json({ message: "Search keyword is required" });
//         }
//         const regex = new RegExp(search, "i");

//         // ✅ Direct প্রশ্নগুলি ফেচ করো
//         const directQuestions = await QuestionsModel.find({
//             $or: [
//                 { Question: regex },
//                 { Subject: regex },
//                 { Option1: regex },
//                 { Option2: regex },
//                 { Option3: regex },
//                 { Option4: regex },
//                 { Explanation: regex }
//             ]
//         }).lean();

//         // ✅ ChapterModel থেকে "file" টাইপ প্রশ্নগুলো বের করো
//         const chapterDocs = await ChaptersModel.find({
//             "questions.fileType": "file"
//         }).lean();

//         const chapterFileQuestions = chapterDocs.flatMap(chapter =>
//             chapter.questions
//                 .filter(q =>
//                     q.fileType === "file" &&
//                     regex.test(q.question || "") // সার্চ কন্ডিশন
//                 )
//                 .map(q => ({
//                     ...q,
//                     type: "chapterFile",
//                     chapterId: chapter._id,
//                     chapterName: chapter.chapter_name,
//                 }))
//         );

//         // ✅ Merge করো
//         const mergedQuestions = [
//             ...directQuestions.map(q => ({ ...q, type: "direct" })),
//             ...chapterFileQuestions
//         ];

//         return res.status(200).json({
//             total: mergedQuestions.length,
//             data: mergedQuestions
//         });


//     } catch (error) {
//         console.error("❌ Merging Error:", error);
//         serverError(res, error)
//     }
// }


import { serverError } from "../../helpers/serverError.js"
import ChaptersModel from "../../models/chapters/chapter.model.js";
import QuestionsModel from "../../models/questions/questions.model.js";

export const getMergedQuestions = async (req, res) => {
    const { search = "" } = req.query;

    try {
        if (!search) {
            return res.status(400).json({ message: "Search keyword is required" });
        }

        const regex = new RegExp(search, "i");



        // Step 2: সব প্রশ্ন একত্র করা (QuestionsModel + solutionTable from ChaptersModel)
        const [directQuestions, chapterDocs] = await Promise.all([
            QuestionsModel.find().lean(),
            ChaptersModel.find({ fileType: "file" }).lean()
        ]);

        //  directQuestions থেকে শুধু প্রশ্নগুলো বের করা
        const directQuestionsFlat = directQuestions.flatMap(dq => dq.questions || []);

        const chapterQuestions = chapterDocs.flatMap(chapter =>
            chapter.solutionTable || []
        );

        const allQuestions = [...directQuestionsFlat, ...chapterQuestions];


        // // Step 2: একবারেই সার্চ ফিল্টার
        const filteredQuestions = allQuestions.filter(q =>
            regex.test(q.Question || "") ||
            regex.test(q.Subject || "") ||
            regex.test(q.Option1 || "") ||
            regex.test(q.Option2 || "") ||
            regex.test(q.Option3 || "") ||
            regex.test(q.Option4 || "") ||
            regex.test(q.Subject || "") ||
            regex.test(q.Explanation || "")
        );


        //  alternative
        // const filteredQuestions = allQuestions.filter(q =>
        //     Object.values(q).some(value =>
        //         typeof value === "string" && regex.test(value)
        //     )
        // );

        return res.status(200).json({
            total: filteredQuestions?.length,
            questions: filteredQuestions
        });

    } catch (error) {
        console.error("❌ Merging Error:", error);
        serverError(res, error);
    }
}
