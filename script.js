const BASE_URL = firebaseConfig.databaseURL + "/join/";

let user = [];
let contactList = [];
let taskList = [];

async function init() {
    await connect()
}

async function connect() {
    let response = await fetch(BASE_URL + ".json");
    let json = await response.json();

    user = json.user;
    contactList = json.contactList;
    taskList = json.taskList;
}