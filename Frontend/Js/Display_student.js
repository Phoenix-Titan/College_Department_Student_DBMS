import {showToast} from './toast.js'

// When Student display page loads run Function
document.addEventListener("DOMContentLoaded", ()=>{
    getAllStudentRecord()
})


/**
 * This is responsible for get all the student data from the 
 * backend and returing it.
*/
const getAllStudentRecord = async ()=>{
    try {
        const API_GET_URL = 'http://127.0.0.1:4000/api/v1/StudentRecords/allRecord';
        const response = await axios.get(API_GET_URL);

        if(response.data.Data && Array.isArray(response.data.Data)){
            // Run the dispaly student Record function
            display_all_student_Record(response.data);
        }
        else{
            showToast("No student Records Found","error")
        }

    }
    catch(err) {
        console.log(err);
        showToast("Failed to load Records","error");
    }
}

/**
 * This is used to render all the student data Records pass to it 
 * on the DOM 
 * @param {Object} responseData 
 * @returns 
 */
const display_all_student_Record = (responseData) => {
    const Card_container = document.querySelector('.main-content');

    // Clear existing content to prevent duplicates on re-render
    Card_container.innerHTML = '';

    // Checks if data object is in responseData and if it is an Array.
    if (!responseData.Data || !Array.isArray(responseData.Data)) {
        console.error("Invalid responseData format:", responseData);
        console.error("No student object Data Found")
        return;
    }

    responseData.Data.forEach((user) => {
        const ProfileCard = document.createElement('div');
        ProfileCard.className = "profile-card";

        // Use the profile_pic_url if available, otherwise use a default image
        const profileImageUrl = user.profile_pic_url ? user.profile_pic_url : './Images/images.png';

        ProfileCard.innerHTML = `
            <div class="Profile_card_img">
                <img src="${profileImageUrl}" alt="${user.name}'s profile picture">
            </div>
            <h2>${user.name}</h2>
            <div class="profile-details">
                <p><strong>Student ID:</strong> <span>${user.studentID}</span></p>
                <p><strong>Department:</strong>${user.department}</p>
                <p><strong>Level:</strong> ${user.level}</p>
            </div>
        `;

        ProfileCard.addEventListener('click',()=>{
            window.location.href =`Student_profile.html?studentID=${user._id}`
        })
        

        Card_container.append(ProfileCard);
    });
};

