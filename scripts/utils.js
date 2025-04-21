/**
 * Deletes the contacts that are included in any task on the board
 *
 * @param {number} id - ID number of the contact that got deleted
 * @param {*} fromContact - When deleted on contact page, return it immediately with the successContact
 * @returns {Promise<void>} - Is either awaited or ignored
 */
async function deleteContactFromTask(id, fromContact) {
    taskList.forEach(taskGroup => {
        taskGroup.tasks.forEach(task => {
            task.assignedTo = task.assignedTo.filter(contactId => contactId !== id);
        });
    });
    if (fromContact) {
        return successContact("Contact deleted successfully.");
    }
    await updateTaskList("Contact deleted");
}

/**
 * Toggles the logout menu
 */
function toggleLogoutMenu() {
    const logoutMenu = document.getElementById('logout-menu')
    logoutMenu.classList.toggle('d-none');
}

/**
 * Toggles the menus for the contact page
 */
function toggleContactMenu() {
    document.getElementById('con-display').classList.toggle('d-none');
    document.getElementById('con-sidebar').style.display = 'unset';
}

/**
 * Toggles the login forms
 */
function signUp() {
    document.querySelectorAll("#login-form, #signUp-form, #signUp-group")
        .forEach(el => el.classList.toggle("d-none"));
}

/**
 * Changes the password img on the right to either one of 2 symbols, depending on if symbol is clicked
 * and also changes the type of the input
 *
 * @param {string} pass - The value of a password input field
 */
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

/**
 * Changes the password img on the right to either one of 2 symbols, depending on if It's empty or not
 *
 * @param {string} pass - The value of a password input field
 */
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

/**
 * Breaks the name into 2 initials
 *
 * @param {string} contactName - Name of a person
 * @returns {string} - 2 initials like <MM> Max Mustermann
 */
function getContactInitials(contactName) {
    let name = contactName.trim();
    let abbr = name.indexOf(" ");
    let initials = name.slice(0, 1);

    if (abbr !== -1) {
        initials += name.slice(abbr + 1, abbr + 2);
    }

    return initials.toUpperCase();
}

/**
 * Toggles class d-none
 *
 * @param {string} id - Is a given ID / html tag
 */
function toggleVisibility(id) {
    document.getElementById(`${id}`).classList.toggle('d-none')
}

/**
 * Clears the tags insides
 *
 * @param {string} elementId - Is a given ID / html tag
 */
function clearInnerHtml(elementId) {
    document.getElementById(elementId).innerHTML = '';
}

/**
 * Transforms the first letter to uppercase
 *
 * @param {string} word - A given word
 * @returns {*|string} - Returns the word with the uppercase letter at the first index
 */
function firstLetterToUpperCase(word) {
    if (word.length === 0) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Saves the path to get back to
 */
function savePath() {
    let path = window.location.pathname;
    let pathElp = path.substring(path.lastIndexOf("/") + 1);

    localStorage.setItem("path", `${pathElp}`);
    window.location.href = "../pages/help.html";
}

/**
 * Get the path to get back to
 */
function getPath() {
    let pathElp = localStorage.getItem("path");
    window.location.href = `../pages/${pathElp}`;
}

/**
 * Checks if inputs are empty and disables the submit button if it is
 *
 * @param {string} form - ID of a specific form
 * @param {number} signUp - Number to check if there is an extra parameter given
 */
function valueEmpty(form, signUp) {
    const inputs = document.querySelectorAll(`#${form} .input-group input`);

    let button;

    if (signUp) {
        button = document.getElementById(`sign-sub`)
    } else {
        button = document.querySelector(`#${form} button:nth-child(2)`)
    }

    button.disabled = Array.from(inputs).some(input => input.value === "");
}

/**
 * Sets the input date to current day
 */
function setTodaysDate() {
    const today = new Date().toISOString().split('T')[0];
    document.querySelector('input[type="date"]').setAttribute('min', today);
}
