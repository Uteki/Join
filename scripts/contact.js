const outputMenu = document.querySelector("#con-sidebar output");
const displaySection = document.getElementById("big-contact");

const display = document.getElementById("con-display");
const sidebar = document.getElementById("con-sidebar");

const dropdownMenu = document.querySelector(".dd-menu");

/**
 * Loads and renders the full contact list into the sidebar, 
 * grouped by the first letter of each contact's name.
 */
async function renderContact() {
    let index;
    await init(); windowContact();
    outputMenu.innerHTML = "";

    for (let i = 0; i < contactList.length; i++) {
        if (contactList[i].name.charAt(0) !== index) {
            outputMenu.innerHTML += addAbbreviation(contactList[i].name.charAt(0));
            index = contactList[i].name.charAt(0);
        }
        outputMenu.innerHTML += contactButtonTemplate(await getIni(contactList[i].name), contactList[i].name, contactList[i].email, contactList[i].id, contactList[i].color);
    }
}

/**
 * Displays the detailed contact information in the main view for the given contact ID.
 * @param {number} id - The ID of the contact to display.
 */
async function displayContact(id) {
    let contact = contactList.find(el => el.id === id); removeActiveContact()
    document.getElementById(`contact${id}`).classList.add("contact-active");

    displaySection.innerHTML = "";
    displaySection.innerHTML += contactTemplate(await getIni(contact.name), contact.name, contact.email, contact.phone, contact.id, contact.color);

    dropdownMenu.innerHTML = dropdownTemplate(id, contact.name, contact.email, contact.phone, contact.color);

    if (window.innerWidth <= 670) {
        display.classList.remove("d-none");
        sidebar.style.display = "";
    }
}

/**
 * Converts a contact's full name to their initials.
 * For example, "John Doe" becomes "JD".
 * @param {string} contact - The full name of the contact.
 * @returns {string} The initials of the contact.
 */
async function getIni(contact) {
    let name = contact.trim();
    let abbr = name.indexOf(" ");
    let initials = name.slice(0, 1);

    if (abbr !== -1) {
        initials += name.slice(abbr + 1, abbr + 2);
    } return initials;
}

/**
 * Adjusts the layout to display only the contact sidebar on smaller screens.
 */
function windowContact() {
    if (window.innerWidth <= 670) {
        document.getElementById("con-display").classList.add("d-none");
        document.getElementById("con-sidebar").style.display = "unset";
    }
}

/**
 * Removes the "active" highlight class from all contact buttons.
 */
function removeActiveContact() {
    document.querySelectorAll("#con-sidebar output button").forEach((button) => {
        button.classList.remove("contact-active");
    })
}