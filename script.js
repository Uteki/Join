const BASE_URL = firebaseConfig.databaseURL + "/join/";

let user = [];
let contactList = [];
let taskList;

async function init() {
    await connect()
}

async function connect() {
    let response = await fetch(BASE_URL + ".json");
    let json = await response.json();

    user = json.user;
    contactList = json.contactList.sort((a, b) => a.name.localeCompare(b.name));
    taskList = await JSON.parse(json.tasks);
}

async function updateTaskList(successMessage) {
    const response = await fetch(BASE_URL + '.json', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tasks: JSON.stringify(taskList),
        })
    });
    if (successMessage !== null) {
        response.ok ? createSuccessToast(successMessage || 'Successful Submit') : createErrorToast('An error occured');
    }
}

async function updateUl() {
    let response = await fetch(BASE_URL + ".json");
    let json = await response.json();
    return json.contactList;
}