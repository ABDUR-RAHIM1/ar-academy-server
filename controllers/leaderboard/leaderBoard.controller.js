
import { serverError } from "../../helpers/serverError.js"
import ResultsModel from "../../models/results/results.model.js"

// export const getLeaderBoardByCoure = async (req, res) => {
//     try {
//         const { courseId } = req.params;
//         if (!courseId) {
//             return res.status(400).json({ message: "courseId is required" });
//         }

//         const results = await ResultsModel.find()
//             .populate("question", "course")
//             .populate("user", "name email photo");
//         // console.log(results)

//         /** course id fetch kora  */
//         const filteredCourseId = results.filter(r =>
//             r?.question?.course?.toString() === courseId.toString()

//         );

//         console.log({ filteredCourseId })


//     } catch (error) {
//         console.log(error)
//         return serverError(500, "failed to fetch result details")
//     }
// }

// export const getLeaderBoardByCourse = async (req, res) => {
//     try {
//         const { courseId } = req.params;

//         if (!courseId) {
//             return res.status(400).json({ message: "courseId is required" });
//         }

//         // Step 1: Fetch all results with user and question populated
//         const results = await ResultsModel.find()
//             .populate("question", "course subjectName")       // question.course needed
//             .populate("user", "username email"); // user info

//         // Step 2: Filter results for the specific courseId
//         const filtered = results.filter(r =>
//             r?.question?.course?.toString() === courseId.toString()
//         );

//         if (!filtered.length) {
//             return res.status(200).json({
//                 success: true,
//                 courseId,
//                 leaderboardCount: 0,
//                 leaderboard: [],
//                 message: "No results found for this course"
//             });
//         }

//         // Step 3: Group by user and calculate totals
//         const leaderboardMap = {};

//         filtered.forEach(r => {
//             const uid = r.user._id.toString();

//             if (!leaderboardMap[uid]) {
//                 leaderboardMap[uid] = {
//                     user: r.user,          // name, email, photo
//                     totalMarks: 0,
//                     totalSkip: 0,
//                     totalIsPass: 0,
//                     totalIsFail: 0,
//                     totalResults: 0,
//                     totalQuestions: 0,
//                     history: []
//                 };
//             }

//             // Update totals
//             leaderboardMap[uid].totalMarks += Number(r.totalmark) || 0;
//             leaderboardMap[uid].totalSkip += Number(r.skip) || 0;
//             leaderboardMap[uid].totalQuestions += Number(r.totalQuestions) || 0;
//             leaderboardMap[uid].totalResults += 1;

//             if (r.isPass) {
//                 leaderboardMap[uid].totalIsPass += 1;
//             } else {
//                 leaderboardMap[uid].totalIsFail += 1;
//             }

//             // Add history (exclude unwanted fields)
//             leaderboardMap[uid].history.push({
//                 questionId: r.question?._id,
//                 questionName: r.question.subjectName || "N/A",
//                 correctAns: r.correctAns,
//                 wrongAns: r.wrongAns,
//                 skip: r.skip,
//                 totalmark: r.totalmark,
//                 passMark: r.passMark,
//                 isPass: r.isPass || "N/A",
//                 cutMark: r.nagetiveMark,
//                 totalQuestions: r.totalQuestions,
//                 createdAt: r.createdAt
//             });
//         });

//         // Step 4: Convert object to array & sort by totalMarks desc
//         const leaderboard = Object.values(leaderboardMap)
//             .sort((a, b) => b.totalMarks - a.totalMarks);

//         // Step 5: Send response
//         return res.status(200).json({
//             leaderboardCount: leaderboard.length,
//             leaderboard
//         });

//     } catch (error) {
//         console.error(error);
//         return serverError(500, "failed to fetch leaderboard details");
//     }
// };


export const getLeaderBoardByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!courseId) {
            return res.status(400).json({ message: "courseId is required" });
        }

        // Step 1: Fetch all results with user and question populated
        const results = await ResultsModel.find()
            .populate("question", "course subjectName") // question + subjectName
            .populate("user", "username email");       // user info

        // Step 2: Filter results for the specific courseId
        const filtered = results.filter(r =>
            r?.question?.course?.toString() === courseId.toString()
        );

        if (!filtered.length) {
            return res.status(200).json({
                success: true,
                courseId,
                leaderboardCount: 0,
                leaderboard: [],
                message: "No results found for this course"
            });
        }

        // Step 3: Group by user and calculate totals
        const leaderboardMap = {};

        // filtered.forEach(r => {
        //     const uid = r.user._id.toString();

        //     if (!leaderboardMap[uid]) {
        //         leaderboardMap[uid] = {
        //             user: r.user,
        //             totalMarks: 0,
        //             totalSkip: 0,
        //             totalIsPass: 0,
        //             totalIsFail: 0,
        //             totalResults: 0,
        //             totalQuestions: 0,
        //             totalCutMark: 0,  // ⭐ NEW FIELD ⭐
        //             history: []
        //         };
        //     }

        //     leaderboardMap[uid].totalMarks += Number(r.totalmark) || 0;
        //     leaderboardMap[uid].totalSkip += Number(r.skip) || 0;
        //     leaderboardMap[uid].totalQuestions += Number(r.totalQuestions) || 0;

        //     // ⭐ total attempted
        //     const attempted = (Number(r.totalQuestions) || 0) - (Number(r.skip) || 0);
        //     leaderboardMap[uid].totalAttempted += attempted;

        //     // totalCutMark
        //     leaderboardMap[uid].totalCutMark += (Number(r.wrongAns) || 0) * (Number(r.nagetiveMark) || 0);

        //     leaderboardMap[uid].totalResults += 1;

        //     if (r.isPass) leaderboardMap[uid].totalIsPass += 1;
        //     else leaderboardMap[uid].totalIsFail += 1;

        //     // history
        //     leaderboardMap[uid].history.push({
        //         questionId: r.question?._id,
        //         questionName: r.question?.subjectName || "N/A",
        //         correctAns: r.correctAns,
        //         wrongAns: r.wrongAns,
        //         skip: r.skip,
        //         attempted: attempted, // ⭐ new field
        //         totalmark: r.totalmark,
        //         passMark: r.passMark,
        //         cutMark: r.nagetiveMark,
        //         isPass: r.isPass,
        //         totalQuestions: r.totalQuestions,
        //         createdAt: r.createdAt
        //     });
        // });

     filtered.forEach(r => {
    const uid = r.user._id.toString();

    if (!leaderboardMap[uid]) {
        leaderboardMap[uid] = {
            user: r.user,              // user info: username, email, photo
            totalMarks: 0,
            totalSkip: 0,
            totalIsPass: 0,
            totalIsFail: 0,
            totalResults: 0,
            totalQuestions: 0,
            totalAttempted: 0,         // attempted questions
            totalCutMark: 0,           // total cut marks
            totalCorrect: 0,           // ⭐ new field
            totalWrong: 0,             // ⭐ new field
            history: []
        };
    }

    // Calculate attempted questions for this result
    const attempted = (Number(r.totalQuestions) || 0) - (Number(r.skip) || 0);
    const wrong = Number(r.wrongAns) || 0;
    const correct = Number(r.correctAns) || 0;
    const cutMark = wrong * (Number(r.nagetiveMark) || 0);

    // Update totals
    leaderboardMap[uid].totalMarks += Number(r.totalmark) || 0;
    leaderboardMap[uid].totalSkip += Number(r.skip) || 0;
    leaderboardMap[uid].totalQuestions += Number(r.totalQuestions) || 0;
    leaderboardMap[uid].totalAttempted += attempted;
    leaderboardMap[uid].totalCutMark += cutMark;
    leaderboardMap[uid].totalCorrect += correct;  // ⭐ add
    leaderboardMap[uid].totalWrong += wrong;      // ⭐ add
    leaderboardMap[uid].totalResults += 1;

    // Pass / Fail count
    if (r.isPass) leaderboardMap[uid].totalIsPass += 1;
    else leaderboardMap[uid].totalIsFail += 1;

    // Add history record
    leaderboardMap[uid].history.push({
        questionId: r.question?._id,
        questionName: r.question?.subjectName || "N/A",
        correctAns: r.correctAns,
        wrongAns: r.wrongAns,
        skip: r.skip,
        attempted: attempted,
        totalmark: r.totalmark,
        passMark: r.passMark,
        cutMark: cutMark,
        isPass: r.isPass,
        totalQuestions: r.totalQuestions,
        createdAt: r.createdAt
    });
});


        // Step 4: Convert object to array & sort by totalMarks DESC
        const leaderboard = Object.values(leaderboardMap)
            .sort((a, b) => b.totalMarks - a.totalMarks);

        // Step 5: Send response
        return res.status(200).json({
            leaderboardCount: leaderboard.length,
            leaderboard
        });

    } catch (error) {
        console.error(error);
        return serverError(500, "failed to fetch leaderboard details");
    }
};
