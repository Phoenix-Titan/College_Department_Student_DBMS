import { showToast } from "./toast.js";


document.addEventListener('DOMContentLoaded', () => {
    SignUpNewUser();
})



const SignUpNewUser = () => {
    const API_SIGN_UP_URL = 'http://localhost:4000/api/v1/UserAuth/signUp';
    const signUpUserForm = document.getElementById('SignUpUserForm');

    signUpUserForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            // const formData = new FormData(signUpUserForm);
            // console.log(formData.get("username"));
            // console.log(formData.get("password"))
            const username = document.getElementById('username')
            const password = document.getElementById('password')
            const confirm_password = document.getElementById('Confirm')
            const signUp_key = document.getElementById('SignUp_Key')

            if (password.value.length < 10 || confirm_password.value.length < 10) {
                password.style.border = '2px solid red'
                showToast("Password should be more than 10 characters", 'error')
                return;

            } else if (password.value !== confirm_password.value) {
                confirm_password.style.border = '2px solid red'
                showToast("Your Password does not match.", 'error')
                return;

            } else {
                const formData = {
                    Username: username.value,
                    Password: password.value,
                    SignUp_key: signUp_key.value,
                }

                JSON.stringify(formData)
                const response = await axios.post(API_SIGN_UP_URL, formData);
                console.log(response);

                //this clears the signup form if an ok respnse is sent.
                if (response.status === 200) {
                    signUpUserForm.reset();
                }

            }



        } catch (error) {
            if (error.response) {
                console.error(`Error in response : ${error.response.data.error || error.response.statusText}`)
            } else if (error.request) {
                console.error(`Error in request : ${error.request}`)
            }
            console.log(error)
            showToast("Something went wrong in creating the account", 'error')
        }
    })
}