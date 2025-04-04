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

function showPassword(pass) {
    let input = document.getElementById(`${pass}`);
    let bgImg = document.querySelector(`.input-group:has(#${pass}) i picture`);

    if (input.type === "password") {
        input.type = "text";
        bgImg.style.backgroundImage = "url('../assets/svg/form-icons/visibility.svg')";
    } else {
        input.type = "password";
        bgImg.style.backgroundImage = "url('../assets/svg/form-icons/visibility_off.svg')";
    }
}

function inputPassword(pass) {
    let value = document.getElementById(`${pass}`).value;
    let pic = document.querySelector(`.input-group:has(#${pass}) i picture`);
    let img = document.querySelector(`.input-group:has(#${pass}) i img:first-child`);

    pic.classList.remove("d-none");
    img.classList.add("d-none");

    if (value === "") {
        img.classList.remove("d-none");
        pic.classList.add("d-none");
    }
}

function getContactInitials(contactName){
    let name = contactName.trim();
    let abbr = name.indexOf(" ");
    let initials = name.slice(0, 1);

    if (abbr !== -1) {
        initials += name.slice(abbr + 1, abbr + 2);
    }

    return initials.toUpperCase();
}

function toggleVisibility(id){
    document.getElementById(`${id}`).classList.toggle('d-none')
}

function clearInnerHtml(elementId){
    document.getElementById(elementId).innerHTML = '';
}

function firstLetterToUpperCase(word) {
    if (word.length === 0) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
}