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

// add task form

function openAddTaskForm(column, singleTask) {
    const body = document.querySelector('body')
    if (!singleTask) body.innerHTML += boardAddTaskTemplate();
    selectedColumn = column;
    newTask = JSON.parse(JSON.stringify(defaultTask))
    renderAddTaskForm();
}

// add task

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

// set IDs

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

// Overlay editor

function renderAddTaskForm() {
    setTaskPriority('medium', 'addTaskFormMediumBtn');
    renderAddTaskAssigned(contactList);
    renderAddTaskSubtasksList(newTask.subtasks);
}

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

function boardAddTaskFilterContacts() {
    const query = document.getElementById('boardAddTaskContactQueryInput').value
    const filteredContacts = searchContacts(query);
    renderAddTaskAssigned(filteredContacts);
}

function renderAddTaskSubtasksList(subtasks) {
    const boardAddTaskSubtasksList = document.getElementById('boardAddTaskSubtasksList')
    clearInnerHtml('boardAddTaskSubtasksList')
    for (let index = 0; index < subtasks.length; index++) {
        const element = subtasks[index];
        boardAddTaskSubtasksList.innerHTML += addTaskSubtaskListTemplate(element);
    }
}

function addTaskCloseAssignedSelection() {
    const boardAddTaskAssignedSelection = document.getElementById('boardAddTaskAssignedSelection');
    boardAddTaskAssignedSelection.classList.add('d-none')
}

function openBoardAddTaskAssignedSelection() {
    const boardAddTaskAssignedSelection = document.getElementById('boardAddTaskAssignedSelection');
    boardAddTaskAssignedSelection.classList.remove('d-none')
}

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

// Subtasks

function createSubtaskToNewTask() {
    if (document.getElementById('addSubtaskInput').value.length >= 4) {
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

function addTaskDeleteSubtask(subtaskId) {
    const subtaskMatchesId = (element) => element.id === subtaskId;
    const subTaskIndex = newTask.subtasks.findIndex(subtaskMatchesId)
    newTask.subtasks.splice(subTaskIndex, 1)
    clearInnerHtml('subtaskEditorContainer')
    renderAddTaskSubtasksList(newTask.subtasks);
}

function addTaskStartSubtaskEditing(subtaskId) {
    const subtaskEditorContainer = document.getElementById('subtaskEditorContainer')
    clearInnerHtml('boardAddTaskSubtasksList')
    const subtaskMatchesId = (element) => element.id === subtaskId;
    const subTaskIndex = newTask.subtasks.findIndex(subtaskMatchesId)
    const subtask = newTask.subtasks[subTaskIndex]
    subtaskEditorContainer.innerHTML += addTaskSubtaskEditorTemplate(subtask);
}

function addTaskChangeSubtaskDescription(subtaskId) {
    const editSubtaskInput = document.getElementById('editSubtaskInput')
    const subtaskMatchesId = (element) => element.id === subtaskId;
    const subTaskIndex = newTask.subtasks.findIndex(subtaskMatchesId)
    newTask.subtasks[subTaskIndex].description = editSubtaskInput.value
    clearInnerHtml('subtaskEditorContainer')
    renderAddTaskSubtasksList(newTask.subtasks);
}

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


// submit functions
function validateForm() {
    let form = document.getElementById("boardAddTaskForm");
    let submitButton = document.getElementById("boardAddTaskSubmitButton");
    submitButton.disabled = !form.checkValidity();
}

function setTitle() {
    newTask.title = document.getElementById('addTaskTitleInput').value
}

function setTaskDescription() {
    newTask.description = document.getElementById('addTaskDescriptionInput').value
}

function setTaskDate() {
    newTask.dueDate = document.getElementById('addTaskDateInput').value
}

function setCategory() {
    newTask.category = document.getElementById('boardAddTaskCategoryInput').value
}

function setTaskPriority(newPrio, buttonID) {
    newTask.priority = newPrio;
    const buttons = document.getElementsByClassName('task-overview-editor-priority-button');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active-priority-button-urgent', 'active-priority-button-medium', 'active-priority-button-low');
    }
    document.getElementById(buttonID).classList.toggle(`active-priority-button-${newPrio}`);
}

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
    }

    return newId;
}

// singleAddTaskForm

async function singleTask() {
    await init();
    openAddTaskForm('To do', 'task')
}

async function singleAddNewTask() {
    await addNewTask();
    clearNewTask();

    setTimeout(() =>
    window.location.href = "../pages/board.html"
    , 1750);
}

function clearNewTask() {
    newTask.title = document.getElementById('addTaskTitleInput').value ="";
    newTask.dueDate = document.getElementById('addTaskDateInput').value = "";
    newTask.category = document.getElementById('boardAddTaskCategoryInput').value = "";
    newTask.description = document.getElementById('addTaskDescriptionInput').value = "";

    newTask.priority = "medium"; setTaskPriority('medium', 'addTaskFormMediumBtn');
    newTask.subtasks = []; document.getElementById('boardAddTaskSubtasksList').innerHTML = '';
    newTask.assignedTo = []; document.getElementById('boardAddTaskAssignedContacts').innerHTML = '';
}