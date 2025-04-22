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
 * Opens the add-task form and initializes a new task based on the default structure.
 * @param {string} column - Name of the column where the task will be added.
 * @param {string} singleTask - If set, prevents rendering the form (used in task.html).
 */
function openAddTaskForm(column, singleTask) {
    const body = document.querySelector('body')
    if (!singleTask) body.innerHTML += boardAddTaskTemplate();
    selectedColumn = column;
    newTask = JSON.parse(JSON.stringify(defaultTask))
    renderAddTaskForm();
}

/**
 * Collects input values, creates a new task, adds it to the task list, and updates the UI.
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
 * Generates a unique task ID based on existing IDs.
 * @returns {number} Unique task ID.
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
 * Renders the add-task form and sets initial values like default priority and today's date.
 */
function renderAddTaskForm() {
    setTaskPriority('medium', 'addTaskFormMediumBtn');
    renderAddTaskAssigned(contactList);
    renderAddTaskSubtasksList(newTask.subtasks);
    setTodaysDate();
}

/**
 * Renders the list of assignable contacts in the form.
 * @param {number[]} contactsToRender - Array of contact IDs to render.
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
 * Renders the list of selected contacts with initials.
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
 * Highlights the contact if already selected.
 * @param {Object} element - Contact object.
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
 * Filters the contact list based on the user's input.
 */
function boardAddTaskFilterContacts() {
    const query = document.getElementById('boardAddTaskContactQueryInput').value
    const filteredContacts = searchContacts(query);
    renderAddTaskAssigned(filteredContacts);
}

/**
 * Renders the list of subtasks.
 * @param {Object[]} subtasks - List of subtasks.
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
 * Hides the contact assignment list.
 */
function addTaskCloseAssignedSelection() {
    const boardAddTaskAssignedSelection = document.getElementById('boardAddTaskAssignedSelection');
    boardAddTaskAssignedSelection.classList.add('d-none')
    showCategoryAndSubtaskInput();
}

/**
 * Opens up the contact list selection.
 */
function openBoardAddTaskAssignedSelection() {
    const boardAddTaskAssignedSelection = document.getElementById('boardAddTaskAssignedSelection');
    boardAddTaskAssignedSelection.classList.remove('d-none')
    hideCategoryAndSubtaskInput();
}

/**
 * Adds or deletes contactID to or from task assigned contacts.
 * @param {number} contactId 
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
 * Hides category and subtask input for better UI.
 */
function hideCategoryAndSubtaskInput() {
    const list = ['boardAddTaskCategory', 'boardAddTaskSubtasks'];
    for (let index = 0; index < list.length; index++) {
        const element = document.getElementById(list[index]);

        element.classList.add('v-hidden');
    }
}

/**
 * Shows previously hidden category and subtask inputs.
 */
function showCategoryAndSubtaskInput() {
    const list = ['boardAddTaskCategory', 'boardAddTaskSubtasks'];
    for (let index = 0; index < list.length; index++) {
        const element = document.getElementById(list[index]);

        element.classList.remove('v-hidden');
    }
}

/**
 * Creates a new subtask and adds it to the new task.
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
 * Removes a subtask by its ID.
 * @param {number} subtaskId - ID of the subtask to be deleted.
 */
function addTaskDeleteSubtask(subtaskId) {
    const subtaskMatchesId = (element) => element.id === subtaskId;
    const subTaskIndex = newTask.subtasks.findIndex(subtaskMatchesId)
    newTask.subtasks.splice(subTaskIndex, 1)
    clearInnerHtml('subtaskEditorContainer')
    renderAddTaskSubtasksList(newTask.subtasks);
}

/**
 * Opens the editor for a subtask.
 * @param {number} subtaskId - ID of the subtask to edit.
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
 * Updates the subtask description or deletes it if input is empty.
 * @param {number} subtaskId - ID of the subtask.
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
 * Generates a unique ID for a subtask.
 * @returns {number} Unique subtask ID.
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
 * Validates the add-task form.
 */
function validateForm() {
    let form = document.getElementById("boardAddTaskForm");
    let submitButton = document.getElementById("boardAddTaskSubmitButton");
    submitButton.disabled = !form.checkValidity();
}

/**
 * Sets the task title based on the input value.
 */
function setTitle() {
    newTask.title = document.getElementById('addTaskTitleInput').value
}

/**
 * Sets the task description based on the input value.
 */
function setTaskDescription() {
    newTask.description = document.getElementById('addTaskDescriptionInput').value
}

/**
 * Sets the task due date based on the input value.
 */
function setTaskDate() {
    newTask.dueDate = document.getElementById('addTaskDateInput').value
}

/**
 * Sets the task category based on the input value.
 */
function setCategory() {
    newTask.category = document.getElementById('boardAddTaskCategoryInput').value
}

/**
 * Sets the task priority and updates the corresponding UI button.
 * @param {string} newPrio - Priority level (low, medium, urgent).
 * @param {string} buttonID - ID of the button to activate.
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
 * Calculates a new unique task ID.
 * @returns {number} New unique task ID.
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
 * Initializes and opens the add-task form in task.html.
 */
async function singleTask() {
    await init();
    openAddTaskForm('To do', 'task')
}

/**
 * Adds a task from task.html and redirects to the board.
 */
async function singleAddNewTask() {
    await addNewTask();
    clearNewTask();

    setTimeout(() =>
    window.location.href = "../pages/board.html"
    , 1750);
}

/**
 * Clears all input fields and resets the new task form.
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