let newTask;
let selectedColumn;

let defaultTask = {
    assignedTo: [],
    category: "",
    description: "",
    dueDate: null,
    id: null,
    priority: null,
    subtasks: [],
    title: "",
};

/**
 * Opens up the add-task form (when in board) and copies the default task to create a new Task.
 * @param {string} column - name of the column
 * @param {string} singleTask - only when funtion gets called in task.html so the form does not get rendered
 */
function openAddTaskForm(column, singleTask) {
    const body = document.querySelector('body')
    if (!singleTask) body.innerHTML += boardAddTaskTemplate();
    selectedColumn = column;
    newTask = JSON.parse(JSON.stringify(defaultTask))
    renderAddTaskForm();
}

/**
 * Sets all input values into the newTask variable, pushes it to the taskList and updates it.
 */
async function addNewTask() {
    setTitle()
    setTaskDescription()
    setTaskDate()
    setCategory()
    newTask.id = setNewTaskId()
    taskList[taskList.findIndex((element) => element.name === selectedColumn)].tasks.push(newTask);
    await updateTaskList('Task added successfully');
    await closeTaskOverlay();
}

/**
 * Calculates a unique id for a task by checking what ids are already in use.
 * @returns {number} - unique task id
 */
function generateNewTaskId() {
    let existingIds = new Set();
    taskList.forEach(list => {
        list.tasks.forEach(task => {
            existingIds.add(task.id);
        });
    });
    let newId = 0;
    while (existingIds.has(newId)) {
        newId++;
    }
    return newId;
}

/**
 * Render specific HTML for the add-task form and sets prio to medium and todays date so no date in the past can be selected as due date.
 */
function renderAddTaskForm() {
    setTaskPriority('medium', 'addTaskFormMediumBtn');
    renderAddTaskAssigned(contactList);
    renderAddTaskSubtasksList(newTask.subtasks);
    setTodaysDate();
}

/**
 * Render contact input list to the form.
 * @param {number[]} contactsToRender - an array with contact ids
 */
function renderAddTaskAssigned(contactsToRender) {
    const boardAddTaskAssignedSelection = document.getElementById('boardAddTaskAssignedSelection')
    clearInnerHtml('boardAddTaskAssignedSelection')
    for (let index = 0; index < contactsToRender.length; index++) {
        const element = contactsToRender[index];
        boardAddTaskAssignedSelection.innerHTML += addTaskAssignedListOptionTemplate(element)
    }
    for (let index = 0; index < contactsToRender.length; index++) {
        const element = contactsToRender[index];
        addTaskCheckIfContactIsAssigned(element);
    }
    renderAddTaskAssignedContacts();
}

/**
 * Render list of assigned contacts user initals.
 */
function renderAddTaskAssignedContacts() {
    const boardAddTaskAssignedContacts = document.getElementById('boardAddTaskAssignedContacts')
    clearInnerHtml('boardAddTaskAssignedContacts')
    const maxDisplayCount = 4;
    let displayedCount = Math.min(newTask.assignedTo.length, maxDisplayCount);
    for (let index = 0; index < displayedCount; index++) {
        const element = newTask.assignedTo[index];
        boardAddTaskAssignedContacts.innerHTML += addTaskAssignedListTemplate(findContact(element));
    }
    if (newTask.assignedTo.length > maxDisplayCount) {
        const excessCount = newTask.assignedTo.length - maxDisplayCount;
        boardAddTaskAssignedContacts.innerHTML += ` +${excessCount}`;
    }
}

/**
 * Render list of assigned contacts user initals in task editor.
 */
function rendertaskOverlayEditorAssignedContacts() {
    const taskOverlayEditorAssignedContacts = document.getElementById('taskOverlayEditorAssignedContacts')
    clearInnerHtml('taskOverlayEditorAssignedContacts')
    const maxDisplayCount = 4;
    let displayedCount = Math.min(editTask.assignedTo.length, maxDisplayCount);
    for (let index = 0; index < displayedCount; index++) {
        const element = editTask.assignedTo[index];
        taskOverlayEditorAssignedContacts.innerHTML += assignedListTemplate(findContact(element));
    }
    if (editTask.assignedTo.length > maxDisplayCount) {
        const excessCount = editTask.assignedTo.length - maxDisplayCount;
        taskOverlayEditorAssignedContacts.innerHTML += ` +${excessCount}`;
    }
}

/**
 * Check if contact has already been selected to a task.
 * @param {*} element 
 */
function addTaskCheckIfContactIsAssigned(element) {
    const check = newTask.assignedTo.includes(element.id)
    const contactElement = document.getElementById(`contact${element.id}`)
    const checkbox = document.getElementById(`contactCheckbox${element.id}`);
    if (check) {
        contactElement.classList.add('assigned-list-option-selected')
        contactElement.classList.remove('assigned-list-option')
        checkbox.checked = true;
    }
}

/**
 * Select the search query, start searching and then start rendering the filtered contactlist of the add-task form.
 */
function boardAddTaskFilterContacts() {
    const query = document.getElementById('boardAddTaskContactQueryInput').value
    const filteredContacts = searchContacts(query);
    renderAddTaskAssigned(filteredContacts);
}

/**
 * Render the list of subtasks to the add-task form.
 * @param {*} subtasks 
 */
function renderAddTaskSubtasksList(subtasks) {
    const boardAddTaskSubtasksList = document.getElementById('boardAddTaskSubtasksList')
    clearInnerHtml('boardAddTaskSubtasksList')
    for (let index = 0; index < subtasks.length; index++) {
        const element = subtasks[index];
        boardAddTaskSubtasksList.innerHTML += addTaskSubtaskListTemplate(element);
    }
}

/**
 * Close the contact list selection.
 */
function addTaskCloseAssignedSelection() {
    const boardAddTaskAssignedSelection = document.getElementById('boardAddTaskAssignedSelection');
    boardAddTaskAssignedSelection.classList.add('d-none')
    showCategoryAndSubtaskInput();
}

/**
 * Open up the contact list selection.
 */
function openBoardAddTaskAssignedSelection() {
    const boardAddTaskAssignedSelection = document.getElementById('boardAddTaskAssignedSelection');
    boardAddTaskAssignedSelection.classList.remove('d-none')
    hideCategoryAndSubtaskInput();
}

/**
 * Adds or deletes contactID to or from task assigned contacts.
 * @param {*} contactId 
 */
function toggleContactToAddTask(contactId) {
    const searchInput = document.getElementById('boardAddTaskContactQueryInput')
    if (newTask.assignedTo.includes(contactId)) {
        const contactIndex = newTask.assignedTo.findIndex((element) => element === contactId);

        newTask.assignedTo.splice(contactIndex, 1);

    } else {
        newTask.assignedTo.push(contactId);
    }
    searchInput.value = '';
    renderAddTaskAssigned(contactList);
}

/**
 * Hide category and subtask input for better UI.
 */
function hideCategoryAndSubtaskInput() {
    const list = ['boardAddTaskCategory', 'boardAddTaskSubtasks'];
    for (let index = 0; index < list.length; index++) {
        const element = document.getElementById(list[index]);

        element.classList.add('v-hidden');
    }
}

/**
 * Show category and subtask input after hiding it.
 */
function showCategoryAndSubtaskInput() {
    const list = ['boardAddTaskCategory', 'boardAddTaskSubtasks'];
    for (let index = 0; index < list.length; index++) {
        const element = document.getElementById(list[index]);

        element.classList.remove('v-hidden');
    }
}

/**
 * Create a new subtask to the created task.
 */
function createSubtaskToNewTask() {
    if (document.getElementById('addSubtaskInput').value.length >= 1) {
        const newSubtask = {
            id: addTaskSetSubtaskId(),
            description: document.getElementById('addSubtaskInput').value,
            finished: false,
        }
        newTask.subtasks.push(newSubtask)
        document.getElementById('addSubtaskInput').value = '';
        renderAddTaskSubtasksList(newTask.subtasks);
    }
}

/**
 * Delete a subtask from the task beeing created.
 * @param {*} subtaskId 
 */
function addTaskDeleteSubtask(subtaskId) {
    const subtaskMatchesId = (element) => element.id === subtaskId;
    const subTaskIndex = newTask.subtasks.findIndex(subtaskMatchesId)
    newTask.subtasks.splice(subTaskIndex, 1)
    clearInnerHtml('subtaskEditorContainer')
    renderAddTaskSubtasksList(newTask.subtasks);
}

/**
 * Start the editor for editing a subtask in the add-task form.
 * @param {*} subtaskId 
 */
function addTaskStartSubtaskEditing(subtaskId) {
    const subtaskEditorContainer = document.getElementById('subtaskEditorContainer')
    clearInnerHtml('boardAddTaskSubtasksList')
    const subtaskMatchesId = (element) => element.id === subtaskId;
    const subTaskIndex = newTask.subtasks.findIndex(subtaskMatchesId)
    const subtask = newTask.subtasks[subTaskIndex]
    subtaskEditorContainer.innerHTML += addTaskSubtaskEditorTemplate(subtask);
}

/**
 * Change the subtask description to the editors input value.
 * @param {*} subtaskId 
 */
function addTaskChangeSubtaskDescription(subtaskId) {
    const editSubtaskInput = document.getElementById('editSubtaskInput')
    const subtaskMatchesId = (element) => element.id === subtaskId;
    const subTaskIndex = newTask.subtasks.findIndex(subtaskMatchesId)
    if(editSubtaskInput.value !== ''){
        newTask.subtasks[subTaskIndex].description = editSubtaskInput.value
    } else {
        addTaskDeleteSubtask(subtaskId);
    }
    clearInnerHtml('subtaskEditorContainer')
    renderAddTaskSubtasksList(newTask.subtasks);
}

/**
 * Get a unique id when creating a new subtask.
 * @returns {number} - unique id for subtask
 */
function addTaskSetSubtaskId() {
    let existingIds = new Set();
    newTask.subtasks.forEach(task => {
        existingIds.add(task.id);
    });
    let newId = 0;
    while (existingIds.has(newId)) {
        newId++;
    }
    return newId;
}

/**
 * Check the validity of the add-task form.
 */
function validateForm() {
    let form = document.getElementById("boardAddTaskForm");
    let submitButton = document.getElementById("boardAddTaskSubmitButton");
    submitButton.disabled = !form.checkValidity();
}

/**
 * Set the title input value to the new task.
 */
function setTitle() {
    newTask.title = document.getElementById('addTaskTitleInput').value
}

/**
 * Set the description input value to the new task.
 */
function setTaskDescription() {
    newTask.description = document.getElementById('addTaskDescriptionInput').value
}

/**
 * Set the date input value to the new task.
 */
function setTaskDate() {
    newTask.dueDate = document.getElementById('addTaskDateInput').value
}

/**
 * Set the category input value to the new task.
 */
function setCategory() {
    newTask.category = document.getElementById('boardAddTaskCategoryInput').value
}

/**
 * Set the priority input value to the new task.
 * @param {string} newPrio 
 * @param {number} buttonID 
 */
function setTaskPriority(newPrio, buttonID) {
    newTask.priority = newPrio;
    const buttons = document.getElementsByClassName('task-overview-editor-priority-button');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active-priority-button-urgent', 'active-priority-button-medium', 'active-priority-button-low');
    }
    document.getElementById(buttonID).classList.toggle(`active-priority-button-${newPrio}`);
}

/**
 * Get an unique id for the new task thats beeing created.
 * @returns {number}
 */
function setNewTaskId() {
    let existingIds = new Set();
    taskList.forEach(list => {
        list.tasks.forEach(task => {
            existingIds.add(task.id);
        });
    });

    let newId = 0;
    while (existingIds.has(newId)) {
        newId++;
    } return newId;
}

/**
 * Start the add-task form in task.html.
 */
async function singleTask() {
    await init();
    openAddTaskForm('To do', 'task')
}

/**
 * Add new Task to taskList from task.html.
 */
async function singleAddNewTask() {
    await addNewTask();
    clearNewTask();

    setTimeout(() =>
    window.location.href = "../pages/board.html"
    , 1750);
}

/**
 * Clear add-task form.
 */
function clearNewTask() {
    newTask.title = document.getElementById('addTaskTitleInput').value ="";
    newTask.dueDate = document.getElementById('addTaskDateInput').value = "";
    newTask.category = document.getElementById('boardAddTaskCategoryInput').value = "";
    newTask.description = document.getElementById('addTaskDescriptionInput').value = "";

    newTask.priority = "medium"; setTaskPriority('medium', 'addTaskFormMediumBtn');
    newTask.subtasks = []; document.getElementById('boardAddTaskSubtasksList').innerHTML = '';
    newTask.assignedTo = []; document.getElementById('boardAddTaskAssignedContacts').innerHTML = '';

    renderAddTaskAssigned(contactList); document.getElementById("boardAddTaskSubmitButton").disabled = true;
}