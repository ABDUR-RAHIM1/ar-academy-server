import SubjectModel from "../../models/questionSheets/SubjectListModel.js";

// multiple SubjectList added
export const addSubjectList = async (req, res) => {
    try {
        const { classId, subjects } = req.body;

        if (!classId) {
            return res.status(400).json({ message: "classId is required" });
        }

        if (!Array.isArray(subjects) || subjects.length === 0) {
            return res.status(400).json({ message: "Please provide an array of subjects" });
        }

        // Validate each item has name and add classId
        const subjectsWithClassId = subjects.map((item) => {
            if (!item.name) {
                throw new Error("Each subject must have a 'name' field");
            }
            return {
                ...item,
                classId, // classId যোগ করা হলো
            };
        });

        const result = await SubjectModel.insertMany(subjectsWithClassId);

        res.status(201).json({
            message: "Subjects added successfully",
            data: result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


//  get all SubjectList
export const getAllSubjectList = async (req, res) => {
    try {

        const allSubjects = await SubjectModel.find()
            .populate("classId", "name")

        res.status(200).json(allSubjects);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// get subject by classId (query paramiters)
export const getSubjectByQuery = async (req, res) => {
    try {
        const { classId } = req.query;
   
        if (!classId) {
            return res.status(400).json({ message: "classId is required" });
        }
        const subjects = await SubjectModel.find({ classId });
        res.status(200).json(subjects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};





// update Subject 
export const updateSubjectList = async (req, res) => {
    try {

        const { classId } = req.params

        const isUpdated = await SubjectModel.findByIdAndUpdate(classId, {
            $set: req.body
        });

        if (!isUpdated) {
            return res.status(404).json({
                message: "Failed to update Subject"
            })
        }

        return res.status(200).json({
            message: "succesfully Updated",

        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

//  delete SubjectList 
export const deleteSubjectList = async (req, res) => {
    const { subjectId } = req.params
    try {

        const isDeleted = await SubjectModel.findByIdAndDelete(subjectId);


        if (!isDeleted) {
            return res.status(404).json({
                message: "Failed to Delete Class"
            })
        }

        return res.status(200).json({
            message: "succesfully Deleted",

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}