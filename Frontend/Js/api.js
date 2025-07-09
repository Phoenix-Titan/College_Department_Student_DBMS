
// import showToast  from "./toast.js";

document.addEventListener("DOMContentLoaded", ()=>{
    
    console.log("create Function started.")
})

/**
 * This is used to send a post request containing student records
 *  to the backend for it to be save and created. It handle basic
 * frontend validations
 * 
 */
const createNewStudentRecord = ()=>{
    // This is the POST API URL for the backend
    const API_SUBMIT_URL = 'http://localhost:4000/api/v1/StudentRecords/createNewRecord'; // Keep your specified URL
    const studentEntryForm = document.getElementById('studentEntryForm');
    const formMessage = document.getElementById('formMessage');

    
    /**
     * @description this is just a test for form submitting
     */
    studentEntryForm.addEventListener('submit', (event)=>{

        event.preventDefault()

        formMessage.textContent = 'Submitting data...'; // Give user feedback
        formMessage.style.color = '#007bff';
        // showToast("Submitting Data....","info")      

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

                // show toast error message
                // showToast("Please fill in all required fields correctly.","error")

                return; // Stop the function if validation fails
            }
            
           
            submitUserData(API_SUBMIT_URL, formData)
        
        })
    
        
    }





const submitUserData = async (API_SUBMIT_URL, formData) =>{
    const response = await axios.post(API_SUBMIT_URL, formData);
    try{
        // Send the POST request using Axios

        // Handle successful response
        // formMessage.textContent = `Student data submitted! `;
        // formMessage.style.color = 'green';
        // showToast("Student Data Successfully Submitted","success");   
        console.log('Successfully submitted student data:', response.data);
        
        // Optionally, clear the form after successful submission
        // studentEntryForm.reset(); // Resets all form fields to their initial state

        
    } catch (err) {
        // Handle errors
        // formMessage.textContent = `Failed to submit student data.`;
        // formMessage.style.color = 'red';
        // showToast("Failed to Submit Student Data.","error")
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
