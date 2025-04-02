function createUser () {

}

let addContact = {
    name: document.getElementById("add-name"),
    email: document.getElementById("add-mail"),
    phone: document.getElementById("add-con"),
}

async function createContact (contacts = contactList, path="contactList/", data={}) {
    let newKey = contacts?.length || 0;

    let test = await fetch(BASE_URL + path + `${newKey}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name: addContact.name.value, email: addContact.email.value, phone: addContact.phone.value, id: await generateId(contactList)})
    });

    await displayContact(newID); // change needed
    return test.json();
}

async function editContact () {
    let test = await fetch(BASE_URL + path + `${newID}.json`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name: addContact.name.value, email: addContact.email.value, phone: addContact.phone.value, id: await generateId(contactList)})
    });
}

async function deleteContact (ID) {
    let test = await fetch(BASE_URL + `contactList/${ID}.json`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    });

    //todo - rearange ids

    return test.json();
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