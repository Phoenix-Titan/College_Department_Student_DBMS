import {showToast}  from "./toast.js";


document.addEventListener('DOMContentLoaded', ()=>{
    const urlParams = new URLSearchParams(window.location.search)
    const edit_studentID = urlParams.get('edit_studentID')
    if (edit_studentID) {
        getStudent_ToBeEditedData(edit_studentID)
    } else {
        showToast("Student Record was not found", 'error');
        showToast("Please try again", 'error')
        return;
    }
})

const getStudent_ToBeEditedData = async (studentID)=>{
    const API__STUDENT_to_edit_PROFILE_URL = `http://localhost:4000/api/v1/StudentRecords/studentProfile/?studentID=${studentID}`; // Keep your specified URL
    try{
        
        const response = await fetch(API__STUDENT_to_edit_PROFILE_URL,{
            method:"GET",
        })
        const responseData = await response.json()
        
        if(response.ok && responseData.Data){
            console.log(responseData.Data)
            const edit_studentData = responseData.Data;
            assignPreviousStudentRecordToForm(edit_studentData)
        }else{
            console.log("error")
        }
       
        EditStudentRecord(studentID)

    }catch(err){
        console.log(err)
    }
}



const assignPreviousStudentRecordToForm = (edit_studentData)=>{
    const StudentId = document.querySelector('#studentId');
    const student_name = document.querySelector("#studentName");
    const student_course = document.querySelector('#courses');
    const student_phoneNumber = document.querySelector('#phoneNumber');
    const student_email = document.querySelector('#email');
    const attendanceRadios = document.querySelectorAll('input[name="attendances"]');
    const student_department = document.querySelector('#department');
    const student_level = document.querySelector('#level');
    const comment = document.querySelector('#comment');
    const currentProfilePic = document.querySelector('#currentProfilePic'); // Get the image element

    // Assinging the student record to the input values for editing.
    StudentId.value = edit_studentData.studentID;
    student_name.value = edit_studentData.name;
    student_email.value = edit_studentData.email;
    student_department.value = edit_studentData.department;
    student_level.value = edit_studentData.level;
    student_phoneNumber.value = edit_studentData.phoneNumber;
    student_course.value = edit_studentData.courses;

    // Set the profile picture
    if (edit_studentData.profile_pic_url) {
        currentProfilePic.src = edit_studentData.profile_pic_url;
    } else {
        // Fallback image if no profile picture URL is provided
        currentProfilePic.src = "../Images/university-of-liberia.webp";
    }


    const student_isAttending = edit_studentData.isAttending;
    attendanceRadios.forEach((attendingStatus)=>{
        let radiobtnBoolean = attendingStatus.value === 'true';
        if(radiobtnBoolean === student_isAttending){
            attendingStatus.checked = true;
        }
    });

    // Handle comments, ensuring you only assign the value if comments exist
    if (edit_studentData.comments && edit_studentData.comments.length > 0) {
        // Assuming you only want to display the first comment if there are multiple
        comment.value = edit_studentData.comments[0].value;
    } else {
        comment.value = ''; // Clear the comment field if no comments exist
    }
    
}

const EditStudentRecord = (edit_studentDataID)=>{
    const API_SUBMIT_URL = `http://localhost:4000/api/v1/StudentRecords/editStudentRecord/${edit_studentDataID}`; // Keep your specified URL
    const studentEntryForm = document.getElementById('studentEntryForm');
    const formMessage = document.getElementById('formMessage');



    studentEntryForm.addEventListener("submit", async (event)=>{
        event.preventDefault()
        
        showToast("Submitting Data....","info")      
        
        // Get the raw comment string
        const rawComment = document.getElementById('comment').value.trim();
        let formattedComments = [];
        if(rawComment){
            // Creates an object on the string from the comment to be sent 
            // to the backend.
            formattedComments.push({
                value: rawComment,
            });
        }
        const formData = new FormData(studentEntryForm)
        
        const courseArray = document.getElementById('courses').value.trim().split(',').map(course => course.trim())
        const isAttendingValue = document.querySelector('input[name="attendances"]:checked')?.value === 'true';
        const studentLevel = document.getElementById('level').value
        formData.set('student_level', parseInt(studentLevel))
        formData.set('student_courses',JSON.stringify(courseArray))
        formData.set('student_isAttending', isAttendingValue.toString());
        formData.set('student_comment', JSON.stringify(formattedComments));
        
        
        
        // This validates the data begin send to the backend server.
        if ( !formData.get('student_studentID') ||
        !formData.get('student_name') ||
        !formData.get('student_department') ||
        !formData.get('student_level') ||
        !formData.get('student_email') ||
        !formData.get('student_phoneNumber') ||
        !formData.get('student_isAttending') || 
        !document.getElementById('courses').value.trim() ||
        (!rawComment && !document.getElementById('comment').value.trim())) 
        {
            formMessage.textContent = 'Please fill in all required fields correctly.';
            formMessage.style.color = 'red';
            
            // // show toast error message
            showToast("Please fill in all required fields correctly.","error")
            
            return; // Stop the function if validation fails
        }
      
       await submitFormData(API_SUBMIT_URL, formData)
        
        
        
    })
    
}





const submitFormData = async (API_SUBMIT_URL, formData) =>{

    try{
        const response = await axios.patch(API_SUBMIT_URL, formData);
        
        showToast("Student Data Successfully Submitted","success");
        const responseData = await response.data;   
        console.log('Successfully submitted student data:', responseData);
        
        // Optionally, clear the form after successful submission
        // studentEntryForm.reset(); // Resets all form fields to their initial state
        window.location.href =`Student_profile.html?studentID=${responseData.data._id}`
        

        return true;
        
    } catch (err) {
        showToast("Failed to Submit Student Data.","error");
        console.error('Error submitting student data:', err);
        
        if (err.response) {
            formMessage.textContent = `Error: ${err.response.data.error || err.response.statusText || 'Server error'}`;
            console.error('Server Error Data:', err.response.data);
            console.error('Server Status:', err.response.status);
        } else if (err.request) {
            formMessage.textContent = 'No response from server.\n Check your network or backend server.';
            console.error('No response received:', err.request);
        } else {
            formMessage.textContent = `Error: ${err.message}`;
            console.error('Request setup error:', err.message);
        }
        
    }
    
}
