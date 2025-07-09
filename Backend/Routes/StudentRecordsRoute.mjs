import { Router } from "express";
import {
     createStudentRecord,
     getAllStudentRecord,
     getStudentById,
     UpdateStudentRecords,
     } from "../Controllers/StudentRecords.mjs";

const route = Router();

//Routes
route.get('/allRecord',getAllStudentRecord);
route.get('/studentProfile/',getStudentById);
route.post('/createNewRecord', createStudentRecord);
route.patch('/editStudentRecord/:studentID',UpdateStudentRecords)




// -------These are the Student Record Routes below

// GET - api/v1/StudentRecords/allRecord
// GET - api/v1/StudentRecords/studentProfile/:studentID
// POST - api/v1/StudentRecords/createNewRecord
// PATCH - api/v1/StudentRecords/editStudentRecord/:studentID






export default route