import ClassListModel from "../../models/questionSheets/ClassListModel.js";

//  multiple ClassList added
export const addClassList = async (req, res) => {
    try {
        const classes = req.body;
   
        if (!Array.isArray(classes) || classes.length === 0) {
            return res.status(400).json({ message: "Please provide an array of classes" });
        }

        // Validate each item has name
        for (const item of classes) {
            if (!item.name) {
                return res.status(400).json({ message: "Each class must have a 'name' field" });
            }
        }

        const result = await ClassListModel.insertMany(classes);

        res.status(201).json({
            message: "Classes added successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


//  get all Classes
export const getAllClassList = async (req, res) => {
    try {

        const allClasses = await ClassListModel.find();

        res.status(200).json(allClasses);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// update Clases 
export const updateClassList = async (req, res) => {
    try {

        const { classId } = req.params

        const isUpdated = await ClassListModel.findByIdAndUpdate(classId, {
            $set: req.body
        });

        if (!isUpdated) {
            return res.status(404).json({
                message: "Failed to update Class"
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

//  delete ClassList 
export const deleteClassList = async (req, res) => {
    const { classId } = req.params
    try {

        const isDeleted = await ClassListModel.findByIdAndDelete(classId);


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