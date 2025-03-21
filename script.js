const BASE_URL = "https://join-f9561-default-rtdb.europe-west1.firebasedatabase.app/join/";

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