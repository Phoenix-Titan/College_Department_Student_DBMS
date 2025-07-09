import mongoose from "mongoose";

const StudentRecordSchema = new mongoose.Schema({
    studentID: {type:String, required:true, trim:true, unique:true},
    profile_pic: {type:String, trim:true},
    name: {type: String, required: true},
    department: {type:String, required:true},
    courses:{type:Array},
    level: {type:Number, required:true, trim:true},
    email: {type:String, required:true, trim:true},
    phoneNumber: {type:String, required:true, trim:true},
    isAttending: {type:Boolean, required:true},
    comments:[{value: {type:String}, published:{type:Date, default: Date.now}}],
})

const StudentRecordModel = mongoose.model('StudentRecord', StudentRecordSchema);

export default StudentRecordModel;