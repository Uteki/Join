let currentDraggedElement;
let filteredTasks = [];
let editTask;
let filteredContacts;

// Render functions

async function renderTasks() {
    await init();
    await renderColumns();
}

async function renderColumns() {
    const boardContent = document.getElementById('boardContent')
    clearInnerHtml('boardContent');
    for (let index = 0; index < taskList.length; index++) {
        const element = taskList[index];
        boardContent.innerHTML += boardColumnTemplate(element, index);
        renderTaskContainer(element.tasks, index);
    }
}

function renderTaskContainer(tasks, columnIndex) {
    const boardColumnTasks = document.getElementById(`boardColumnTasks${columnIndex}`)
    if (tasks.length > 0) {
        for (let index = 0; index < tasks.length; index++) {
            const element = tasks[index];
            boardColumnTasks.innerHTML += boardTaskTemplate(element, columnIndex);
            renderTaskAssignedTo(element.assignedTo, element.id);
        }
    } else {
        boardColumnTasks.innerHTML += boardTaskTemplateEmpty(columnIndex);
    }
}

function renderTaskAssignedTo(assignedContacts, id) {
    const boardTaskInvolved = document.getElementById(`boardTaskInvolved${id}`);
    const maxDisplayCount = 4;
    let displayedCount = Math.min(assignedContacts.length, maxDisplayCount);
    for (let index = 0; index < displayedCount; index++) {
        const element = assignedContacts[index];
        boardTaskInvolved.innerHTML += boardTaskInitalsTemplate(findContact(element));
    }
    if (assignedContacts.length > maxDisplayCount) {
        const excessCount = assignedContacts.length - maxDisplayCount;
        boardTaskInvolved.innerHTML += ` +${excessCount}`;
    }
}

function truncateTaskDescription(description) {
    if (description.length > 50) {
        return description.substring(0, 50) + '...';
    } else {
        return description;
    }
}

function renderTaskPriority(prio) {
    if (prio !== null) {
        return boardTaskPriorityTemplate(prio)
    } else {
        return ''
    }
}

function finishedTasks(subtasks) {
    const finishedCount = subtasks.filter(subtask => subtask.finished === true).length;
    return finishedCount;
}

function progressBarWidth(subtasks) {
    const width = (subtasks.filter(subtask => subtask.finished === true).length / subtasks.length) * 100 + '%';
    return width;
}

// Drag&Drop

function startDragging(id) {
    currentDraggedElement = id;
};

function allowDrop(event) {
    event.preventDefault();
};

function dropHandler(event, targetColumnIndex) {
    event.preventDefault();
    moveTaskToColumn(currentDraggedElement, targetColumnIndex);
};

async function moveTaskToColumn(taskId, targetColumnIndex) {
    let taskToMove = null;
    taskList.forEach((column, colIndex) => {
        if (column.tasks) {
            const taskIndex = column.tasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                sourceColumnIndex = colIndex;
                taskToMove = column.tasks.splice(taskIndex, 1)[0];
            }
        }
    });
    if (taskList[targetColumnIndex].tasks) {
        taskList[targetColumnIndex].tasks.push(taskToMove);
    } else {
        taskList[targetColumnIndex].tasks = [taskToMove];
    }
    await updateTaskList();
    renderTasks();
}

function highlightDropArea(id) {
    document.getElementById(`${id}`).classList.add('drag-area-highlight')
}

function removeHighlightDropArea(id) {
    document.getElementById(`${id}`).classList.remove('drag-area-highlight')
}

// Overlay
function openTaskOverlay(taskId, columnIndex) {
    const body = document.querySelector('body')
    const taskMatchesId = (element) => element.id === taskId;
    const taskIndex = taskList[columnIndex].tasks.findIndex(taskMatchesId)
    const task = taskList[columnIndex].tasks[taskIndex]
    body.innerHTML += boardOverlayTemplate(task, columnIndex);
    renderOverlayAssignedTo(task);
    renderOverlaySubtasks(task, columnIndex, taskIndex);
}

async function closeTaskOverlay() {
    await updateTaskList();
    const taskOverviewOverlay = document.getElementById('taskOverviewOverlay')
    const boardAddTaskOverlayContainer = document.getElementById('boardAddTaskOverlayContainer')
    
    boardAddTaskOverlayContainer.classList.add('slide-out');
    boardAddTaskOverlayContainer.addEventListener('animationend', async () => {
        boardAddTaskOverlayContainer.classList.remove('slide-out');
        taskOverviewOverlay.remove()
        renderTasks();
    });
    

}

function renderOverlayAssignedTo(task) {
    const taskOverviewAssignedContainer = document.getElementById('taskOverviewAssignedContainer')
    for (let index = 0; index < task.assignedTo.length; index++) {
        const element = task.assignedTo[index];
        taskOverviewAssignedContainer.innerHTML += overviewAssignedTemplate(findContact(element));
    }
};

function findContact(id) {
    const contactIndex = contactList.findIndex((element) => element.id === id);
    if (contactIndex >= 0) {
        return contactList[contactIndex]
    } else {
        deleteContactFromTask(id)
        renderTasks();
    }

}

function renderOverlaySubtasks(task, columnIndex, taskIndex) {
    const taskOverviewSubtasks = document.getElementById('taskOverviewSubtasks')
    for (let index = 0; index < task.subtasks.length; index++) {
        const element = task.subtasks[index];
        taskOverviewSubtasks.innerHTML += overviewSubtaskTemplate(element, columnIndex, taskIndex, index);
    }
};

function toggleSubtaskCheckbox(columnIndex, taskIndex, subtaskIndex) {
    const task = taskList[columnIndex].tasks[taskIndex]
    task.subtasks[subtaskIndex].finished = !task.subtasks[subtaskIndex].finished;
}

// Overlay editor

async function startOverlayEditor(taskId, columnIndex) {
    const taskOverviewOverlayContainer = document.getElementById('taskOverviewOverlayContainer')
    taskOverviewOverlayContainer.remove()
    createTaskCopy(taskId, columnIndex);
    renderOverlayEditor(taskId, columnIndex);
}

function createTaskCopy(taskId, columnIndex) {
    const taskMatchesId = (element) => element.id === taskId;
    const taskIndex = taskList[columnIndex].tasks.findIndex(taskMatchesId)
    editTask = JSON.parse(JSON.stringify(taskList[columnIndex].tasks[taskIndex]));
}

function renderOverlayEditor(id, columnIndex) {
    const overlay = document.getElementById('taskOverviewOverlay')
    const taskMatchesId = (element) => element.id === id;
    const taskIndex = taskList[columnIndex].tasks.findIndex(taskMatchesId)
    const task = taskList[columnIndex].tasks[taskIndex]
    overlay.innerHTML += boardOverlayEditorTemplate(task, columnIndex);
    renderOverlayEditorAssigned(contactList);
    rendertaskOverviewSubtasksList(task.subtasks);
    changeTaskPriority(editTask.priority, `boardEditor${firstLetterToUpperCase(editTask.priority)}Btn`);
};

function renderOverlayEditorAssigned(contactsToRender) {
    const taskOverlayEditorAssignedSelection = document.getElementById('taskOverlayEditorAssignedSelection')
    clearInnerHtml('taskOverlayEditorAssignedSelection')
    for (let index = 0; index < contactsToRender.length; index++) {
        const element = contactsToRender[index];
        taskOverlayEditorAssignedSelection.innerHTML += assignedListOptionTemplate(element)
    }
    for (let index = 0; index < contactsToRender.length; index++) {
        const element = contactsToRender[index];
        checkIfContactIsAssigned(element);
    }
    rendertaskOverlayEditorAssignedContacts();
}

function rendertaskOverlayEditorAssignedContacts() {
    const taskOverlayEditorAssignedContacts = document.getElementById('taskOverlayEditorAssignedContacts')
    clearInnerHtml('taskOverlayEditorAssignedContacts')
    for (let index = 0; index < editTask.assignedTo.length; index++) {
        const element = editTask.assignedTo[index];
        taskOverlayEditorAssignedContacts.innerHTML += assignedListTemplate(findContact(element));
    }
};

function checkIfContactIsAssigned(element) {
    const check = editTask.assignedTo.includes(element.id)
    const contactElement = document.getElementById(`contact${element.id}`)
    const checkbox = document.getElementById(`contactCheckbox${element.id}`);
    if (check) {
        contactElement.classList.add('assigned-list-option-selected')
        contactElement.classList.remove('assigned-list-option')
        checkbox.checked = true;
    }
}

function filterContacts() {
    const query = document.getElementById('editorContactQueryInput').value
    const filteredContacts = searchContacts(query);
    renderOverlayEditorAssigned(filteredContacts);
}

function searchContacts(query) {
    const lowerQuery = query.toLowerCase();
    let filteredContacts = contactList.filter((contact) => contact.name.toLowerCase().includes(lowerQuery));
    return filteredContacts;
}

function rendertaskOverviewSubtasksList(subtasks) {
    const taskOverlaySubtasksList = document.getElementById('taskOverlaySubtasksList')
    clearInnerHtml('taskOverlaySubtasksList')
    for (let index = 0; index < subtasks.length; index++) {
        const element = subtasks[index];
        taskOverlaySubtasksList.innerHTML += editorSubtaskListTemplate(element);
    }
}

function closeAssignedSelection() {
    const taskOverlayEditorAssignedSelection = document.getElementById('taskOverlayEditorAssignedSelection');
    if (!taskOverlayEditorAssignedSelection.classList.contains('d-none')) {
        taskOverlayEditorAssignedSelection.classList.add('d-none')
    }
}

function openAssignedSelection() {
    const taskOverlayEditorAssignedSelection = document.getElementById('taskOverlayEditorAssignedSelection');
    taskOverlayEditorAssignedSelection.classList.remove('d-none')
}

// Overlay Editor edit functions


function changeTitle() {
    editTask.title = document.getElementById('editorTitleInput').value
}

function changeTaskDescription() {
    editTask.description = document.getElementById('editorTaskDescriptionInput').value
}

function changeTaskDate() {
    editTask.dueDate = document.getElementById('editorDateInput').value
}

function changeTaskPriority(newPrio, buttonID) {
    editTask.priority = newPrio;
    const buttons = document.getElementsByClassName('task-overview-editor-priority-button');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active-priority-button-urgent', 'active-priority-button-medium', 'active-priority-button-low');
    }
    document.getElementById(buttonID).classList.toggle(`active-priority-button-${newPrio}`);
}

function toggleContactToTask(contactId) {
    const searchInput = document.getElementById('editorContactQueryInput')
    if (editTask.assignedTo.includes(contactId)) {
        const contactIndex = editTask.assignedTo.findIndex((element) => element === contactId);

        editTask.assignedTo.splice(contactIndex, 1);

    } else {
        editTask.assignedTo.push(contactId);
    }
    searchInput.value = '';
    renderOverlayEditorAssigned(contactList);
}
// Subtasks

function addSubtask() {
    const newSubtask = {
        id: generateNewSubtaskId(),
        description: document.getElementById('addSubtaskInput').value,
        finished: false,
    }
    editTask.subtasks.push(newSubtask)
    document.getElementById('addSubtaskInput').value = '';
    rendertaskOverviewSubtasksList(editTask.subtasks);
}

function generateNewSubtaskId() {
    let existingIds = new Set();
    editTask.subtasks.forEach(task => {
        existingIds.add(task.id);
    });
    let newId = 0;
    while (existingIds.has(newId)) {
        newId++;
    }
    return newId;
}

function deleteSubtask(subtaskId) {
    const subtaskMatchesId = (element) => element.id === subtaskId;
    const subTaskIndex = editTask.subtasks.findIndex(subtaskMatchesId)
    editTask.subtasks.splice(subTaskIndex, 1)
    clearInnerHtml('subtaskEditorContainer')
    rendertaskOverviewSubtasksList(editTask.subtasks);
}

function startSubtaskEditing(subtaskId) {
    const subtaskEditorContainer = document.getElementById('subtaskEditorContainer')
    clearInnerHtml('taskOverlaySubtasksList')
    const subtaskMatchesId = (element) => element.id === subtaskId;
    const subTaskIndex = editTask.subtasks.findIndex(subtaskMatchesId)
    const subtask = editTask.subtasks[subTaskIndex]
    subtaskEditorContainer.innerHTML += editorSubtaskEditorTemplate(subtask);
}

function changeSubtaskDescription(subtaskId) {
    const editSubtaskInput = document.getElementById('editSubtaskInput')
    const subtaskMatchesId = (element) => element.id === subtaskId;
    const subTaskIndex = editTask.subtasks.findIndex(subtaskMatchesId)
    editTask.subtasks[subTaskIndex].description = editSubtaskInput.value
    clearInnerHtml('subtaskEditorContainer')
    rendertaskOverviewSubtasksList(editTask.subtasks);
}

// Board Task filter functions

function filterTasks() {
    const query = document.getElementById('boardSearchInput').value
    const filteredTasks = searchTasks(query);
    renderfilteredTasks(filteredTasks);
}

function searchTasks(query) {
    const lowerQuery = query.toLowerCase();
    return taskList
        .map(category => {
            const filteredTasks = category.tasks.filter(task =>
                task.title.toLowerCase().includes(lowerQuery)
            );
            return {
                ...category,
                tasks: filteredTasks
            };
        });
}

function renderfilteredTasks(filteredTasks) {
    const boardContent = document.getElementById('boardContent')
    boardContent.innerHTML = '';
    for (let index = 0; index < filteredTasks.length; index++) {
        const element = filteredTasks[index];
        boardContent.innerHTML += boardColumnTemplate(element, index);
        renderTaskContainer(element.tasks, index);
    }
};

// Submit changes

function submitTaskChanges(taskId, columnIndex) {
    const taskMatchesId = (element) => element.id === taskId;
    const taskIndex = taskList[columnIndex].tasks.findIndex(taskMatchesId)
    taskList[columnIndex].tasks[taskIndex] = editTask;
    updateTaskList();
    closeTaskOverlay();
}

function deleteTaskFromBoard(taskId, columnIndex) {
    const taskMatchesId = (element) => element.id === taskId;
    const taskIndex = taskList[columnIndex].tasks.findIndex(taskMatchesId)
    taskList[columnIndex].tasks.splice(taskIndex, 1)
    updateTaskList();
    closeTaskOverlay();
}




