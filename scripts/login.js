function signUp() {
    document.querySelectorAll("#login-form, #signUp-form, #signUp-group")
        .forEach(el => el.classList.toggle("d-none"));
}

//TODO - ... show password
function showPassword() {
    let value = document.getElementById("myInput");
    if (value.type === "password") {
        value.type = "text";
    } else {
        value.type = "password";
    }
}