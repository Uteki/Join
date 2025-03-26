function toggleLogoutMenu(){
    const logoutMenu = document.getElementById('logout-menu')
    logoutMenu.classList.toggle('d-none');
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

function getContactInitials(contactName){
    let name = contactName.trim();
    let abbr = name.indexOf(" ");
    let initials = name.slice(0, 1);

    if (abbr !== -1) {
        initials += name.slice(abbr + 1, abbr + 2);
    }

    return initials;
}

function toggleVisibility(id){
    document.getElementById(`${id}`).classList.toggle('d-none')
}