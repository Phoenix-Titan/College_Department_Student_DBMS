import {showToast} from "./toast.js";


document.addEventListener('DOMContentLoaded', ()=>{
    console.log("Page Loaded"); // This should be the first frontend log you see
    createNewStudentRecord();
    setupProfilePicPreview(); // Call the new function to set up the preview
})

const createNewStudentRecord = ()=>{
    // Make sure this is the POST endpoint for creating a record
    const API_SUBMIT_URL = 'http://localhost:4000/api/v1/StudentRecords/createNewRecord'; 
    const studentEntryForm = document.getElementById('studentEntryForm');
    const formMessage = document.getElementById('formMessage');

    if (!studentEntryForm) {
        console.error("ERROR: studentEntryForm element not found in the DOM!");
        showToast("Initialization Error: Form element missing.","error");
        return; 
    }

    studentEntryForm.addEventListener("submit", async (event)=>{
        event.preventDefault() 
        console.log("Submit event listener fired and preventDefault() called."); // NEW LOG 1
        
        try { 
            showToast("Submitting Data....","info")      
            console.log("Toast function called."); // NEW LOG 2
            
            const rawCommentInput = document.getElementById('comment');
            if (!rawCommentInput) { 
                throw new Error("HTML element with ID 'comment' not found.");
            }
            const rawComment = rawCommentInput.value.trim();
            let formattedComments = [];
            if(rawComment){
                formattedComments.push({
                    value: rawComment,
                });
            }
            console.log("Comment processed."); // NEW LOG 3

            const formData = new FormData(studentEntryForm); 
            // console.log("FormData created."); // NEW LOG 4
            // // Iterate and log formData content for debugging
            // console.log("--- Contents of FormData object ---");
            // for (let [key, value] of formData.entries()) {
            //     // If the value is a File object, log its name and size
            //     if (value instanceof File) {
            //         console.log(`${key}: File Name - ${value.name}, Size - ${value.size} bytes, Type - ${value.type}`);
            //     } else {
            //         console.log(`${key}: ${value}`);
            //     }
            // }
            // console.log("--- End FormData Contents ---");


            const courseInput = document.getElementById('courses');
            if (!courseInput) { 
                throw new Error("HTML element with ID 'courses' not found.");
            }
            const courseArray = courseInput.value.trim().split(',').map(course => course.trim());
            
            const attendanceInput = document.querySelector('input[name="attendances"]:checked');
            const isAttendingValue = attendanceInput?.value === 'true';

            const levelInput = document.getElementById('level');
            if (!levelInput) { 
                throw new Error("HTML element with ID 'level' not found.");
            }
            const studentLevel = levelInput.value;

            console.log("All individual elements retrieved."); // NEW LOG 5

            formData.set('student_level', parseInt(studentLevel));
            formData.set('student_courses',JSON.stringify(courseArray));
            formData.set('student_isAttending', isAttendingValue.toString());
            formData.set('student_comment', JSON.stringify(formattedComments));
            
            console.log("FormData populated."); // NEW LOG 6

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
                showToast("Please fill in all required fields correctly.","error")
                return; 
            }
            console.log("Validation passed. Attempting API submission."); // NEW LOG 7
        
            const success = await submitFormData(API_SUBMIT_URL, formData);
            if (success) {
               console.log("It's working. (SUCCESS PATH ENTERED)"); 
               studentEntryForm.reset(); 
               // Reset the image preview after successful submission
               document.getElementById('profilePicPreview').src = "https://placehold.co/150x150/E0E0E0/374151?text=No+Image";
            }
        } catch (error) {
            console.error("Synchronous error within submit event listener:", error); // NEW LOG 8 for sync errors
            showToast("An unexpected error occurred. Check console.","error"); 
            if (formMessage) {
                formMessage.textContent = `Client-side error: ${error.message}`;
                formMessage.style.color = 'red';
            }
        }
    })
}

// Function to handle profile picture preview
const setupProfilePicPreview = () => {
    const profilePicInput = document.getElementById('Profile_pic');
    const profilePicPreview = document.getElementById('profilePicPreview');

    if (profilePicInput && profilePicPreview) {
        profilePicInput.addEventListener('change', (event) => {
            const file = event.target.files[0]; // Get the selected file

            if (file) {
                const reader = new FileReader(); // Create a FileReader object

                reader.onload = (e) => {
                    // When the file is loaded, set the image source to the result
                    profilePicPreview.src = e.target.result;
                };

                reader.readAsDataURL(file); // Read the file as a Data URL (base64 encoded)
            } else {
                // If no file is selected, revert to the placeholder image
                profilePicPreview.src = "https://placehold.co/150x150/E0E0E0/374151?text=No+Image";
            }
        });
    } else {
        console.error("Profile picture input or preview element not found.");
    }
};


const submitFormData = async (API_SUBMIT_URL, formData) =>{
    console.log("submitFormData function called."); // NEW LOG 9
    console.log("Checking if axios is defined:", typeof axios !== 'undefined' ? 'Defined' : 'Undefined'); 
    
    try{
        console.log("About to call axios.post"); // NEW LOG 10
        // PAUSE EXECUTION HERE
        // Ensure this is axios.post for testing the POST issue
        const response = await axios.post(API_SUBMIT_URL, formData);
        console.log("Axios.post call completed."); // NEW LOG 11
        
        showToast("Student Data Successfully Submitted","success"); 
        console.log('Successfully submitted student data:', response.data); 
        studentEntryForm.reset(); 

        return
        
    } catch (err) {
        showToast("Failed to Submit Student Data.","error")
        console.error('Error submitting student data:', err);
        
        if (err.response) {
            formMessage.textContent = `Error: ${err.response.data.error || err.response.statusText || 'Server error'}`;
            console.error('Server Error Data:', err.response.data);
            console.error('Server Status:', err.response.status);
        } else if (err.request) {
            formMessage.textContent = 'No response from server.\\n Check your network or backend server.';
            console.error('No response received:', err.request);
        } else {
            formMessage.textContent = `Error: ${err.message}`;
            console.error('Request setup error:', err.message);
        }
        throw err; 
    }
}
