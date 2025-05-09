const BASE_URL = firebaseConfig.databaseURL + "/join/";

let user = [];
let contactList = [];
let taskList;

/**
 * Initializes the connection
 *
 * @returns {Promise<void>} - Resolves after all steps are complete
 */
async function init() {
    await connect()
}

/**
 * Fetch data from firebase and loads it into different lists
 *
 * @returns {Promise<void>} - Resolves after all steps are complete
 */
async function connect() {
    let response = await fetch(BASE_URL + ".json");
    let json = await response.json();

    user = json.user;
    contactList = json.contactList.sort((a, b) => a.name.localeCompare(b.name));
    taskList = await JSON.parse(json.tasks);
}

/**
 * Update the taskList
 *
 * @param successMessage - Message given
 * @param {Boolean} noToast - Keyword
 * @returns {Promise<void>} - Resolves after all steps are complete
 */
async function updateTaskList(successMessage, noToast) {
    let response = await pushTaskList()
    if(noToast === true){
        return
    } else if (successMessage !== null) {
        response.ok ? createSuccessToast(successMessage || 'Successful Submit') : createErrorToast('An error occured');
    }
}

/**
 * Pushes the taskList
 * @returns {Promise<void>} - Resolves after all steps are complete
 */
async function pushTaskList(){
    const response = await fetch(BASE_URL + '.json', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tasks: JSON.stringify(taskList),
        })
    });
    return response;
}

/**
 * Fetch contact data as an unsorted list
 *
 * @returns {Promise<*>} - Resolves after all steps are complete
 */
async function updateUl() {
    let response = await fetch(BASE_URL + ".json");
    let json = await response.json();
    return json.contactList;
}