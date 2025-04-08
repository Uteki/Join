let newTask;

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

function openAddTaskForm() {
    const body = document.querySelector('body')
    body.innerHTML += boardAddTaskTemplate();
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
    taskList[taskList.findIndex((element) => element.name === 'To do')].tasks.push(newTask);
    await closeTaskOverlay()
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
    renderAddTaskAssigned(contactList);
    renderAddTaskSubtasksList(newTask.subtasks);
};

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
    for (let index = 0; index < newTask.assignedTo.length; index++) {
        const element = newTask.assignedTo[index];
        boardAddTaskAssignedContacts.innerHTML += addTaskAssignedListTemplate(findContact(element));
    }
};

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
    const newSubtask = {
        id: addTaskSetSubtaskId(),
        description: document.getElementById('addSubtaskInput').value,
        finished: false,
    }
    newTask.subtasks.push(newSubtask)
    document.getElementById('addSubtaskInput').value = '';
    renderAddTaskSubtasksList(newTask.subtasks);
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
    for (var i = 0; i < buttons.length; i++) {
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