console.log("client validation ran!")

//DOM elements
const updateForm = document.getElementById("updateForm")
const inputs = document.getElementsByClassName("inputs")
const errorMessages = document.getElementsByClassName("error-message")
const MIN_AGE = 1
const MAX_AGE = 100

//validation patterns
const patterns = {
    username: /^[a-zA-Z0-9]{4,}$/,
    password: /^[a-zA-Z0-9@*#&!?]{8,15}$/,
    email: /^[0-9a-zA-Z]+([0-9a-zA-Z]*[-._+])*[0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*([0-9a-zA-Z]*[.])[a-zA-Z]{2,3}$/,
}

//events
updateForm.addEventListener('submit', (event) => {
    clearErrors()

    //validate if passwords are both the same at abide by passwordPattern
    const isPasswordMatchValid = validatePasswordMatch(inputs[1], inputs[2], 'password2Error')
    const isPassword1Valid = validateInput(inputs[1], patterns.password, 'password1Error', 'Password must be 8-15 characters long and contain only letters, numbers, and special characters @*#&!?')
    const isPassword2Valid = validateInput(inputs[2], patterns.password, 'password1Error', 'Password must be 8-15 characters long and contain only letters, numbers, and special characters @*#&!?')
    const isPasswordValid = isPasswordMatchValid && isPassword1Valid && isPassword2Valid

    //validate email
    const isEmailValid = validateInput(inputs[3], patterns.email, 'emailError', 'Please enter a valid email address.')


    //validate select inputs
    const isQuestion1Valid = validateSelect(inputs[5], 'question1Error', 'Please select an answer for Question 1.')
    const isQuestion2Valid = validateSelect(inputs[6], 'question2Error', 'Please select an answer for Question 2.')
    const isQuestion3Valid = validateSelect(inputs[7], 'question3Error', 'Please select an answer for Question 3.')
    const isQuestionsValid = isQuestion1Valid && isQuestion2Valid && isQuestion3Valid

    //combine all validity checks
    const formIsValid = isPasswordValid && isEmailValid && isQuestionsValid

    //prevent form submission if validation fails
    if (!formIsValid) {
        event.preventDefault()
    }
})

//helper functions
function setError(id, message) {
    document.getElementById(id).textContent = message
}

function clearErrors() {
    Array.from(errorMessages).forEach(error => error.textContent = "")
}

function validateInput(input, pattern, errorId, errorMessage) {
    const isValid = pattern.test(input.value)

    if (!isValid) {
        setError(errorId, errorMessage)
    }

    return isValid
}

function validateAge(input, errorId) {
    const age = parseInt(input.value)
    const isValid = age >= MIN_AGE && age <= MAX_AGE

    if (!isValid) {
        setError(errorId, `Age must be between ${MIN_AGE} and ${MAX_AGE}.`)
    }

    return isValid
}

function validatePasswordMatch(password1, password2, errorId) {
    const isValid = password1.value === password2.value

    if (!isValid) {
        setError(errorId, "Passwords do not match.")
    }

    return isValid
}

function validateSelect(input, errorId, errorMessage) {
    const isValid = input.value !== ""

    if (!isValid) {
        setError(errorId, errorMessage)
    }

    return isValid
}