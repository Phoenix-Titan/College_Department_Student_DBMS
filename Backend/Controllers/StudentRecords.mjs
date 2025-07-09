import mongoose from "mongoose";
import StudentRecordModel from "../models/StudentRecordSchema.mjs";
import upload_pic from "../Middlewares/upload_pic_middleware.mjs";

/**
 * This creates a new student Record in the database.
 * @param {*} req 
 * @param {*} res 
*/
const createStudentRecord = async (req, res) => {
    // This is for multer handling the file and text fields data
    upload_pic(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: "Error uploading file.", details: err.message });
        }
       
        // This the were the data is used and save to the database after vaildating.
        try {
            const {
                student_studentID, student_name, student_department,
                student_courses, student_level,
                student_email, student_phoneNumber,
                student_isAttending, student_comment
            } = req.body;

            //If picture is in the req.file get the path and save it else made an empty string ' '.\
            const student_profile_pic = req.file ? req.file.path : " ";

            // -------------------------------------------------------------------------------------

            // Data vaildation
            // ------convert student_courses from a json.stringfy() to and back to an array.
            // The student_course was a string array:'[\"math\"]' so it's
            const parsedCourses = JSON.parse(student_courses);
            // Ensure student_comment is parsed as well if it's stringified JSON
            let parsedComments = [];
            if (student_comment) {
                try {
                    parsedComments = JSON.parse(student_comment);
                    // Ensure it's an array, even if the parsed result is not (e.g., if it was an empty string)
                    if (!Array.isArray(parsedComments)) {
                        parsedComments = [];
                    }
                } catch (parseError) {
                    console.error("Error parsing student_comment:", parseError);
                    parsedComments = []; // Default to empty array on parse error
                }
            }
            // const parsedComments = JSON.parse(student_comment);

            // Create new student record instance
            const newStudentRecord = new StudentRecordModel({
                studentID: student_studentID,
                name: student_name,
                department: student_department,
                courses: parsedCourses, // Use parsed array
                level: student_level,
                email: student_email,
                phoneNumber: student_phoneNumber,
                isAttending: student_isAttending,
                comments: parsedComments, // Use parsed object
                profile_pic: student_profile_pic
            });

            // Save to database
            await newStudentRecord.save();

            // --- IMPORTANT: Send success response after saving ---
            return res.status(201).json({
                message: "Student record created successfully!",
                data: newStudentRecord
            });

        } catch (err) {
            console.log("Error during student record creation/save:", err); // More specific log
            if (err.code === 11000) { // MongoDB duplicate key error (e.g., studentID or email unique constraint)
                return res.status(409).json({ error: "Student ID or Email already exists.", details: err.message });
            }
            return res.status(500).json({ error: "Failed to create student record.", details: err.message });
        }
    })
}

/**
 * This gets all the student record form the database
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getAllStudentRecord = async (req, res) => {
    try {
        const AllRecords = await StudentRecordModel.find({}).sort({_id: -1})

        const formattedData = AllRecords.map(record => ({
            ...record.toObject(),
            profile_pic_url: record.profile_pic ? `${req.protocol}://${req.get('host')}/${record.profile_pic}` : null,
        }));

        return res.status(200).json({
            meg: `All Student data return successfully.`,
            Data: formattedData
        })


    } catch (err) {
        console.log("Error occured when getting all the student Record")
        console.log(err)
        return res.status(500).json({ error: "Failed to retrieve all student records.", details: err.message }); // Added return
    }
}

/**
 * This returns a specified singal student record upon request
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getStudentById = async (req, res) => {
    const { studentID } = req.query
    try {
        const singalStudetnRecord = await StudentRecordModel.findById(studentID); // Assuming studentID is actually _id for findById

        if (!singalStudetnRecord) {
            return res.status(404).json({
                meg: `ERROR: Student with ID ${studentID} was not found.`
            })
        }
        const imageURL = singalStudetnRecord.profile_pic ? `${req.protocol}://${req.get('host')}/${singalStudetnRecord.profile_pic}` : null
        return res.json({
            meg: `Student with ID:${studentID} has been found.`,
            Data: {
                ...singalStudetnRecord.toObject(),
                profile_pic_url: imageURL,
            }
        })

    } catch (err) {
        console.log("An error occurred when getting student record");
        console.log(err);
        return res.status(500).json({ error: "Failed to retrieve student record by ID.", details: err.message }); // Added return
    }
}


/**
 * This is used to update the Student Data.
 * @param {*} req 
 * @param {*} res 
 */
const UpdateStudentRecords = async (req, res) => {
    // Use the upload_pic middleware to handle formData, including files
    upload_pic(req, res, async (err) => {
        if (err) {
            console.error("Multer error during update:", err);
            return res.status(400).json({ error: "Error processing file upload for update.", details: err.message });
        }

        const { studentID } = req.params; // Get ID from URL parameter
        console.log("Backend: Update request for studentID:", studentID);
        console.log("Backend: req.body for update:", req.body);

        try {
            // Find the student record by ID
            const studentRecord = await StudentRecordModel.findById(studentID);

            if (!studentRecord) {
                return res.status(404).json({ message: `Student with ID ${studentID} not found.` });
            }

            // Extract updated data from req.body
            const {
                student_studentID, student_name, student_department,
                student_courses, student_level,
                student_email, student_phoneNumber,
                student_isAttending, student_comment
            } = req.body;

            // Prepare update object
            const updateFields = {};

            // Only update fields if they are provided in the request body
            if (student_studentID !== undefined) updateFields.studentID = student_studentID;
            if (student_name !== undefined) updateFields.name = student_name;
            if (student_department !== undefined) updateFields.department = student_department;
            if (student_email !== undefined) updateFields.email = student_email;
            if (student_phoneNumber !== undefined) updateFields.phoneNumber = student_phoneNumber;
            if (student_isAttending !== undefined) updateFields.isAttending = student_isAttending;

            // Handle courses (parse from JSON string if present)
            if (student_courses !== undefined) {
                try {
                    updateFields.courses = JSON.parse(student_courses);
                } catch (e) {
                    console.error("Error parsing student_courses for update:", e);
                    return res.status(400).json({ error: "Invalid courses format." });
                }
            }

            // Handle level (parse to Int if present)
            if (student_level !== undefined) {
                updateFields.level = parseInt(student_level);
            }

            // Handle comments (parse from JSON string if present, with robustness)
            if (student_comment !== undefined) {
                try {
                    let parsedComments = JSON.parse(student_comment);
                    if (!Array.isArray(parsedComments)) {
                        console.warn("Backend: Parsed comments for update is not an array. Resetting to empty array.");
                        parsedComments = [];
                    }
                    updateFields.comments = parsedComments;
                } catch (e) {
                    console.error("Error parsing student_comment for update:", e);
                    return res.status(400).json({ error: "Invalid comment format." });
                }
            }

            // Handle profile picture
            if (req.file) {
                updateFields.profile_pic = req.file.path;
            } else if (req.body.profile_pic === 'null' || req.body.profile_pic === '') {
                // If the frontend explicitly sends an empty string or 'null' for profile_pic
                // it means the user wants to remove the current picture.
                updateFields.profile_pic = ' '; // Or null, depending on your schema default
            }


            // Update the record
            const updatedRecord = await StudentRecordModel.findByIdAndUpdate(
                studentID,
                { $set: updateFields }, // Use $set to update only provided fields
                { new: true, runValidators: true } // Return the updated document, run schema validators
            );

            if (!updatedRecord) {
                return res.status(404).json({ message: `Student with ID ${studentID} not found after update attempt.` });
            }

            // Send success response
            return res.status(200).json({
                message: "Student record updated successfully!",
                data: updatedRecord
            });

        } catch (err) {
            console.error("Backend: Error updating student record:", err);
            if (err.code === 11000) {
                return res.status(409).json({ error: "Duplicate key error (e.g., Student ID or Email already exists).", details: err.message });
            }
            if (err.name === 'ValidationError') {
                const errors = Object.keys(err.errors).map(key => err.errors[key].message);
                return res.status(400).json({ error: "Validation failed during update.", details: errors });
            }
            return res.status(500).json({ error: "Failed to update student record.", details: err.message });
        }
    });
};

export {
    createStudentRecord,
    getAllStudentRecord,
    getStudentById,
    UpdateStudentRecords,
}