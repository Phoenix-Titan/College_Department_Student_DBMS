import { showToast } from "./toast.js";

document.addEventListener("DOMContentLoaded",()=>{
    const urlParams = new URLSearchParams(window.location.search)
    const studentID = urlParams.get('studentID')

    editStudentRecord(studentID)
    deleteStudentRecord(studentID)

    if (studentID) {
        fetchStudentData(studentID);
    } else {
        showToast("No Student Record was found", 'error');
        return;
    }


})

const fetchStudentData = async (studentID) => {
    const API_GET_STUDENT_BY_ID_URL = `http://127.0.0.1:4000/api/v1/StudentRecords/studentProfile/?studentID=${studentID}`; // Using query parameter

    try {
        const response = await fetch(API_GET_STUDENT_BY_ID_URL,{
            method: "GET",
        });

        const responseData = await response.json();

        console.log(responseData.Data)
        if (response.ok && responseData.Data) {
            displayStudentProfile(responseData.Data);
        } else {
            document.querySelector('.Profile__banner h1').textContent = "Student Not Found";
            document.querySelector('.Profile__info').innerHTML = `<p>${responseData.meg || 'Could not retrieve student data.'}</p>`;
            console.error('Error fetching student data:', responseData.meg);
        }
    } catch (error) {
        // document.querySelector('.Profile__banner h1').textContent = "Error";
        // document.querySelector('.Profile__info').innerHTML = `<p>Failed to load student profile. Please try again later.</p>`;
        console.error('Network error or unexpected issue:', error);
    }
};


const displayStudentProfile = (studentData)=>{
    // Profile image element
    const ProfileImage = document.querySelector('.Profile_pic img');
    // Profile Title detail elements
    const StudentName = document.querySelector('.Profile__title h2');
    const ID_number = document.querySelector('.Profile__studentID');
    const isAttending = document.querySelector('.Profile_isAttending');
    const student_department = document.querySelector('.Profile_department');
    // profile Details element
    const student_course = document.querySelector('.Profile__Course_list');
    // Profile contact element
    const phoneNumber = document.querySelector('.profile__Num');
    const contact_email = document.querySelector('.profile_email')
    // comments element
    const comment_Container = document.querySelector('.Profile_comments_container')


    // This is were all the data is assigned to the elements
    if(studentData.profile_pic_url){
        ProfileImage.src = studentData.profile_pic_url
        ProfileImage.alt = `${studentData.name}'s profile picture`
    }else{
        ProfileImage.src = "./Images/images.png";
        ProfileImage.alt = `Default profile picture`
    }

    StudentName.textContent = studentData.name
    ID_number.textContent =`Student ID: ${studentData.studentID}`
    // isAttending condition
    studentData.isAttending?
    isAttending.textContent= `Is Attending: ✔`: 
    isAttending.textContent= `Is Attending: ❌`;
    student_department.textContent = `Department of ${studentData.department}`;


    studentData.courses.forEach((course)=>{
        const listItem = document.createElement('li')
        listItem.textContent = course
        student_course.append(listItem)
    })
    phoneNumber.textContent = studentData.phoneNumber
    contact_email.textContent = studentData.email
    
    studentData.comments.map((comment)=>{
       const comment_box = document.createElement('div');
       comment_box.classList.add("Profile_comment_details","pop_background")
       comment_box.innerHTML= `
            <p>
                ${comment.value}
            </p>
            <span class="Profile_comment_details_date">
                <b>Published Date:</b><span>  ${comment.published}</span>
            </span>
       `
       comment_Container.append(comment_box)
    })
}

const editStudentRecord = (studentId)=>{
    const editButton = document.querySelector('.edit_btn');

    editButton.addEventListener('click',()=>{
        window.location.href = `Edit_student_Record.html?edit_studentID=${studentId}`
    })

}



const deleteStudentRecord = (studentID)=>{
    const deleteButton = document.querySelector('.delete_btn');

    deleteButton.addEventListener('click',()=>{
       DisplayDeletPrompt()
       
    })
}


const DisplayDeletPrompt = ()=>{
    const deleteContainer = document.querySelector('.deletePrompt_container');
    const coverPage = document.querySelector('.coverPage');
    const promptMessage = document.createElement('div')
    deleteContainer.style.display = 'block'
    coverPage.style.display = 'block'


    promptMessage.innerHTML = `
        <h2>Delete Student Record</h2>
        <p>Do you want to delete this student record ?</p>
        <div class="confirmBtns">
            <button class="yesBtn" value='Yes' type="button">YES</button>
            <button class="noBtn" value="No" type="button">NO</button>
        </div>
    `
    deleteContainer.append(promptMessage)

    Handle_Deletion_prompt_actions( deleteContainer, coverPage, )
}

const Handle_Deletion_prompt_actions = async (deleteContainer, coverPage)=>{
    const yesBtn = document.querySelector('.yesBtn');
    const noBtn = document.querySelector('.noBtn');

      
    if(yesBtn && noBtn){
        yesBtn.addEventListener('click',()=>{
        deleteContainer.innerHTML = ''
        deleteContainer.style.display = 'none'
        coverPage.style.display = "block"

    

        showToast("Student Record Was Delected",'success')
        setTimeout(() => {
            window.location.href = 'Student_Records.html'
        }, 3000);

        })



        noBtn.addEventListener('click',()=>{
            deleteContainer.innerHTML = ''
            deleteContainer.style.display = 'none'
            coverPage.style.display = "none"
            console.log("Student Record deletion was Cancel.")

        })
    }
}