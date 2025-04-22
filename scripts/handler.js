let addContact = {
    name: document.getElementById("add-name"),
    email: document.getElementById("add-mail"),
    phone: document.getElementById("add-con"),
}

let editContact = {
    name: document.getElementById("edit-name"),
    email: document.getElementById("edit-mail"),
    phone: document.getElementById("edit-con"),
}

let conErr = document.querySelector("#add-form .input-group:nth-child(3)");
let ediErr = document.querySelector("#edit-form .input-group:nth-child(3)");

/**
 * Creates a contact
 *
 * @param {Object[]} contacts - List of contacts
 * @param {string} path - DB directory
 * @returns {Promise<void>}
 * @async
 */
async function createContact (contacts = contactList, path="contactList/") {
    if (wrongConData(addContact, conErr, "add-name", "add-mail", "add-con")) return;

    let newKey = contacts?.length || 0; let newId = generateId(contactList);
    let response = await fetch(BASE_URL + path + `${newKey}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name: upperSense(addContact.name.value), email: addContact.email.value, phone: addContact.phone.value, id: newId, color: generateColor()})
    });
    await response.json(); await waitFor(newId); document.getElementById("add-create").disabled = true;
}

/**
 * Render contact, display contact, and quit the modal
 *
 * @param {string} newId - New ID
 * @returns {Promise<void>}
 * @async
 */
async function waitFor(newId) {
    await renderContact();
    await displayContact(newId);

    quitModal("yes");
    successContact("Contact added successfully.");
}

/**
 * Changes data of a contact
 *
 * @param {number|string} ID - Identification nummer
 * @returns {Promise<Object>}
 * @async
 */
async function changeContact(ID) {
    let finder = contactList.findIndex((contact) => contact.id === ID); let uID = contactList[finder].uid
    if (wrongConData(editContact, ediErr, "edit-name", "edit-mail", "edit-con")) return;
    if (uID) window.profileUpdater(uID, editContact)

    let response = await fetch(BASE_URL + `contactList/${await findId(ID)}.json`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email: editContact.email.value, name: editContact.name.value, phone: editContact.phone.value})
    });
    await renderChanges(ID); return response.json();
}

/**
 * Render after changes was made
 *
 * @param {number|string} ID - Identification nummer
 * @returns {Promise<void>}
 * @async
 */
async function renderChanges(ID) {
    await renderContact();
    await displayContact(ID);

    quitModal('yes');
}

/**
 * Removes a contact and triggers id arrangement
 *
 * @param {number|string} ID - Identification nummer
 * @returns {Promise<Object>}
 * @async
 */
async function deleteContact (ID) {
    const updatedList = {};
    let response = await fetch(BASE_URL + `contactList/${await findId(ID)}.json`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    });
    if (response.ok) {
        await rearrangeIds(updatedList); await pushArranged(updatedList);
        displaySection.innerHTML = "";
    }
    await deleteContactFromTask(ID, "From");
    return response.json();
}

/**
 * Rearrange the updated list
 *
 * @param {Object} updatedList - Unordered list
 * @returns {Promise<Object>}
 * @async
 */
async function rearrangeIds(updatedList) {
    let backendList = await updateUl();

    await backendList
        .filter(contact => contact !== null)
        .forEach((contact, index) => {
            updatedList[index] = contact;
        });

    return updatedList;
}

/**
 * Push the ordered list back
 *
 * @param {Object} updatedList - Rearranged list
 * @returns {Promise<void>}
 * @async
 */
async function pushArranged(updatedList) {
    await fetch(BASE_URL + `contactList.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedList)
    });

    await renderContact();
}

/**
 * Find id position
 *
 * @param {number|string} ID - Identification number
 * @returns {Promise<number>}
 * @async
 */
async function findId(ID) {
    let ul = await updateUl();

    for (let i = 0; i < ul.length; i++) {
        if (ul[i].id === ID) return i;
    }
}

/**
 * Generates an unique id
 *
 * @param {Object[]} existingContacts - contactList
 * @returns {number}
 */
function generateId(existingContacts) {
    let newId;
    let unique = false;

    do {
        newId = Math.floor(Math.random() * 10000) + 1;
        unique = !existingContacts.some(contact => contact.id === newId);
    } while (!unique);

    return newId;
}

/**
 * Generates a hex color
 *
 * @returns {string}
 */
function generateColor() {
    return `${Math.floor(Math.random() * 16777215).toString(16)}`;
}

/**
 * Changes the first letter to uppercase
 *
 * @param {string} name - A name
 * @returns {string}
 */
function upperSense(name) {
    return name.toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Check contact validation
 *
 * @param {Object} contact - Contact object
 * @param {HTMLElement} err - Error container
 * @param {string} name - Name
 * @param {string} mail - Mail
 * @param {string} con - Phone
 * @returns {boolean}
 */
function wrongConData(contact, err, name, mail, con) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = contact.phone.value.replace(/\D/g, '');

    let error = false;

    if (contact.name.value.length <= 2 || contact.name.value.length >= 35 || regexNum(contact.name.value)) error = showConError(err, "con-name", name);
    if (!emailRegex.test(contact.email.value)) error = showConError(err, "con-mail", mail);
    if (!/^\+?[0-9\s\-()]{7,20}$/.test(contact.phone.value) || phoneRegex.length < 7 || phoneRegex.length > 15) error = showConError(err, "con-pone", con);

    return error;
}

/**
 * Regex validation for name
 *
 * @param {string} a - Name value
 * @returns {boolean}
 */
function regexNum(a) {
    const regexNumEx = /^[A-Za-zÄäÖöÜüß\s'-]+$/;
    return !regexNumEx.test(a);
}

/**
 * Shows the error
 *
 * @param {HTMLElement} err - Error area
 * @param {string} content - Class
 * @param {string} input - Keyword
 * @returns {boolean}
 */
function showConError(err, content, input) {
    err.classList.add(content);

    if (input) timeItOut(input);

    removeConError(err, content);
    return true;
}

/**
 * Removes the error
 *
 * @param {HTMLElement} err - Error area
 * @param {string} id - Content class
 */
function removeConError(err, id) {
    setTimeout(() => {
        err.classList.remove(id);
    }, 5000);
}

/**
 * Time the error and give it styling
 *
 * @param {string} id - Keyword for identification
 */
function timeItOut(id) {
    let ids = document.getElementById(`${id}`);

    ids.style.border = "1px solid red";

    setTimeout(() => {
        ids.style.border = "1px solid var(--placeholder-grey)";
    }, 5000);
}

/**
 * Displays the message
 *
 * @param {string} message - Message information
 */
function successContact(message) {
    const success = document.getElementById("contact-success");
    success.innerHTML = message;
    success.classList.toggle("d-none");

    setTimeout(() =>
            success.classList.toggle('con-out'),
    1500);

    setTimeout(() => {
        success.classList.toggle("d-none");
        success.classList.toggle("con-out");
    }, 2500);
}