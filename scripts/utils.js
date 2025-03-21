const logoutMenu = document.getElementById('logout-menu')

function toggleLogoutMenu(){
    logoutMenu.classList.toggle('d-none')
}

function toggleContactMenu(){
    document.getElementById('con-display').classList.toggle('d-none');
    document.getElementById('con-sidebar').style.display = 'unset';
}

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