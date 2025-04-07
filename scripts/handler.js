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

async function createContact (contacts = contactList, path="contactList/", data={}) {
    if (wrongConData()) return;

    let newKey = contacts?.length || 0; let newId = generateId(contactList);
    let response = await fetch(BASE_URL + path + `${newKey}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name: upperSense(addContact.name.value), email: addContact.email.value, phone: addContact.phone.value, id: newId, color: generateColor()})
    });

    await response.json(); await waitFor(newId);
}

async function waitFor(newId) {
    await renderContact();
    await displayContact(newId);

    quitModal("yes");
    successContact();
}

async function changeContact(ID) {
    let response = await fetch(BASE_URL + `contactList/${await findId(ID)}.json`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: editContact.email.value || "no@mail",
            name: editContact.name.value || "Anon",
            phone: editContact.phone.value || "0",
        })
    });

    await renderChanges(ID)
    return response.json();
}

async function renderChanges(ID) {
    await renderContact();
    await displayContact(ID);

    quitModal('yes');
}

async function deleteContact (ID) {
    const updatedList = {};
    await deleteContactFromTask(ID)
    let response = await fetch(BASE_URL + `contactList/${await findId(ID)}.json`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    });

    await rearrangeIds(updatedList); await pushArranged(updatedList);

    displaySection.innerHTML = "";
    return response.json();
}

async function rearrangeIds(updatedList) {
    let backendList = await updateUl();

    await backendList
        .filter(contact => contact !== null)
        .forEach((contact, index) => {
            updatedList[index] = contact;
        });

    return updatedList;
}

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

async function findId(ID) {
    let ul = await updateUl();

    for (let i = 0; i < ul.length; i++) {
        if (ul[i].id === ID) return i;
    }
}

function generateId(existingContacts) {
    let newId;
    let unique = false;

    do {
        newId = Math.floor(Math.random() * 10000) + 1;
        unique = !existingContacts.some(contact => contact.id === newId);
    } while (!unique);

    return newId;
}

function generateColor() {
    return `${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function upperSense(name) {
    return name.toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function wrongConData() {
    if (addContact.name.value.length < 1) return showConError(conErr, "con-name", "add-name");
    if (!addContact.email.value.includes("@") || !addContact.email.value.includes(".")) return showConError(conErr, "con-mail", "add-mail");
    if (addContact.phone.value < 1 || isNaN(addContact.phone.value) && addContact !== undefined) return showConError(conErr, "con-pone", "add-con");
}

function showConError(err, content, input) {
    err.classList.add(content);

    if (input) timeItOut(input);

    removeConError(err, content);
    return true;
}

function removeConError(err, id) {
    setTimeout(() => {
        err.classList.remove(id);
    }, 5000);
}

function timeItOut(id) {
    let ids = document.getElementById(`${id}`);

    ids.style.border = "1px solid red";

    setTimeout(() => {
        ids.style.border = "1px solid var(--placeholder-grey)";
    }, 5000);
}

function successContact() {
    const success = document.getElementById("contact-success");
    success.classList.toggle("d-none");

    setTimeout(() =>
            success.classList.toggle('con-out'),
    1500);

    setTimeout(() => {
        success.classList.toggle("d-none");
        success.classList.toggle("con-out");
    }, 2500);
}