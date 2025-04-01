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

async function createContact (contacts = contactList, path="contactList/", data={}) {
    let newKey = contacts?.length || 0;

    let response = await fetch(BASE_URL + path + `${newKey}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name: addContact.name.value, email: addContact.email.value, phone: addContact.phone.value, id: await generateId(contactList)})
    });

    await displayContact(newID); // change needed
    return response.json();
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
    let response = await fetch(BASE_URL + `contactList/${await findId(ID)}.json`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    });

    await rearrangeIds(updatedList);
    await pushArranged(updatedList);

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

function generateId(existingContacts) {
    let newId;
    let unique = false;

    do {
        newId = Math.floor(Math.random() * 10000) + 1;
        unique = !existingContacts.some(contact => contact.id === newId);
    } while (!unique);

    return newId;
}

async function findId(ID) {
    let ul = await updateUl();

    for (let i = 0; i < ul.length; i++) {
        if (ul[i].id === ID) return i;
    }
}