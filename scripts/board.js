let currentDraggedElement;
let filteredTasks = [];
let editTask;

/**
 * Get and render board html.
 */
async function renderTasks() {
    await init();
    await renderColumns();
}

/**
 * render the columns so tasks can be rendered
 */
async function renderColumns() {
    const boardContent = document.getElementById('boardContent')
    clearInnerHtml('boardContent');
    for (let index = 0; index < taskList.length; index++) {
        const element = taskList[index];
        boardContent.innerHTML += boardColumnTemplate(element, index);
        renderTaskContainer(element.tasks, index);
    }
}

/**
 * Render a task container for every task in a column.
 * @param {*} tasks 
 * @param {number} columnIndex 
 */
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

/**
 * Render contact initials that are assigned to the task.
 * @param {*} assignedContacts 
 * @param {number} id 
 */
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

/**
 * Cut off the description if its too long.
 * @param {string} description 
 * @returns 
 */
function truncateTaskDescription(description) {
    if (description.length > 50) {
        return description.substring(0, 50) + '...';
    } else {
        return description;
    }
}

/**
 * Render priority icon to task container.
 * @param {string} prio 
 * @returns {string}
 */
function renderTaskPriority(prio) {
    if (prio !== null) {
        return boardTaskPriorityTemplate(prio)
    } else {
        return ''
    }
}

/**
 * Get task priority.
 * @param {string} prio 
 * @returns {string}
 */
function getTaskPriority(prio) {
    if (prio !== null) {
        return prio;
    } else {
        return '';
    }
}

/**
 * Filter how many subtasks of a task are finished.
 * @param {*} subtasks 
 * @returns {number} - how many subtasks of a task are finished
 */
function finishedTasks(subtasks) {
    const finishedCount = subtasks.filter(subtask => subtask.finished === true).length;
    return finishedCount;
}

/**
 * Calculate the width of the progress bar for the subtask progress.
 * @param {*} subtasks 
 * @returns {string} - width of the progressbar in percent
 */
function progressBarWidth(subtasks) {
    const width = (subtasks.filter(subtask => subtask.finished === true).length / subtasks.length) * 100 + '%';
    return width;
}

/**
 * Add the overlay html to the body and start rendering information content.
 * @param {number} taskId 
 * @param {number} columnIndex 
 */
function openTaskOverlay(taskId, columnIndex) {
    const body = document.querySelector('body')
    const taskMatchesId = (element) => element.id === taskId;
    const taskIndex = taskList[columnIndex].tasks.findIndex(taskMatchesId)
    const task = taskList[columnIndex].tasks[taskIndex]
    body.innerHTML += boardOverlayTemplate(task, columnIndex);
    renderOverlayAssignedTo(task);
    renderOverlaySubtasks(task, columnIndex, taskIndex);
}

/**
 * Close overlay and rerender the board.
 */
async function closeTaskOverlay() {
    const taskOverviewOverlay = document.getElementById('taskOverviewOverlay')
    const boardAddTaskOverlayContainer = document.getElementById('boardAddTaskOverlayContainer')
    if (boardAddTaskOverlayContainer) {
        boardAddTaskOverlayContainer.classList.add('slide-out');
        boardAddTaskOverlayContainer.addEventListener('animationend', async () => {
            boardAddTaskOverlayContainer.classList.remove('slide-out');
            taskOverviewOverlay.remove()
            await renderTasks();
        });
    } else {
        taskOverviewOverlay.remove()
        await updateTaskList('', true);
        await renderTasks();
    }
}

/**
 * Render the contacts that are assigned to the task.
 * @param {*} task 
 */
function renderOverlayAssignedTo(task) {
    const taskOverviewAssignedContainer = document.getElementById('taskOverviewAssignedContainer')
    for (let index = 0; index < task.assignedTo.length; index++) {
        const element = task.assignedTo[index];
        taskOverviewAssignedContainer.innerHTML += overviewAssignedTemplate(findContact(element));
    }
}

/**
 * Find a contact based on the given ID.
 * @param {number} id 
 * @returns {*}
 */
function findContact(id) {
    const contactIndex = contactList.findIndex((element) => element.id === id);
    if (contactIndex >= 0) {
        return contactList[contactIndex]
    } else {
        deleteContactFromTask(id)
        renderTasks();
    }
}

/**
 * Render the subtasks in they overlay of the selected task.
 * @param {*} task 
 * @param {number} columnIndex 
 * @param {number} taskIndex 
 */
function renderOverlaySubtasks(task, columnIndex, taskIndex) {
    const taskOverviewSubtasks = document.getElementById('taskOverviewSubtasks')
    for (let index = 0; index < task.subtasks.length; index++) {
        const element = task.subtasks[index];
        taskOverviewSubtasks.innerHTML += overviewSubtaskTemplate(element, columnIndex, taskIndex, index);
    }
}

/**
 * Check and uncheck a subtask from the list.
 * @param {number} columnIndex 
 * @param {number} taskIndex 
 * @param {number} subtaskIndex 
 */
function toggleSubtaskCheckbox(columnIndex, taskIndex, subtaskIndex) {
    const task = taskList[columnIndex].tasks[taskIndex]
    task.subtasks[subtaskIndex].finished = !task.subtasks[subtaskIndex].finished;
}

/**
 * Start an editor for the selected task in the overlay.
 * @param {number} taskId 
 * @param {number} columnIndex 
 */
async function startOverlayEditor(taskId, columnIndex) {
    const taskOverviewOverlayContainer = document.getElementById('taskOverviewOverlayContainer')
    taskOverviewOverlayContainer.remove()
    createTaskCopy(taskId, columnIndex);
    renderOverlayEditor(taskId, columnIndex);
}

/**
 * Create a copy of the selected task.
 * @param {number} taskId 
 * @param {number} columnIndex 
 */
function createTaskCopy(taskId, columnIndex) {
    const taskMatchesId = (element) => element.id === taskId;
    const taskIndex = taskList[columnIndex].tasks.findIndex(taskMatchesId)
    editTask = JSON.parse(JSON.stringify(taskList[columnIndex].tasks[taskIndex]));
}

/**
 * Render html for the overlay editor.
 * @param {number} id 
 * @param {number} columnIndex 
 */
function renderOverlayEditor(id, columnIndex) {
    const overlay = document.getElementById('taskOverviewOverlay')
    const taskMatchesId = (element) => element.id === id;
    const taskIndex = taskList[columnIndex].tasks.findIndex(taskMatchesId)
    const task = taskList[columnIndex].tasks[taskIndex]
    overlay.innerHTML += boardOverlayEditorTemplate(task, columnIndex);
    renderOverlayEditorAssigned(contactList);
    rendertaskOverviewSubtasksList(task.subtasks);
    changeTaskPriority(editTask.priority, `boardEditor${firstLetterToUpperCase(editTask.priority)}Btn`);
}

/**
 * Render the contact list.
 * @param {*} contactsToRender 
 */
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

/**
 * Render the assigned contacts initials.
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
 * Check if a contact of the list has been assigned and apply styling.
 * @param {*} element 
 */
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

/**
 * Select the search query, start searching and then start rendering the filtered contactlist.
 */
function filterContacts() {
    const query = document.getElementById('editorContactQueryInput').value
    const filteredContacts = searchContacts(query);
    renderOverlayEditorAssigned(filteredContacts);
}

/**
 * Filter the contactList for the query.
 * @param {string} query 
 * @returns list of filtered contacts
 */
function searchContacts(query) {
    const lowerQuery = query.toLowerCase();
    let filteredContacts = contactList.filter((contact) => contact.name.toLowerCase().includes(lowerQuery));
    return filteredContacts;
}

/**
 * Render the subtasklist for the overview container.
 * @param {*} subtasks 
 */
function rendertaskOverviewSubtasksList(subtasks) {
    const taskOverlaySubtasksList = document.getElementById('taskOverlaySubtasksList')
    clearInnerHtml('taskOverlaySubtasksList')
    for (let index = 0; index < subtasks.length; index++) {
        const element = subtasks[index];
        taskOverlaySubtasksList.innerHTML += editorSubtaskListTemplate(element);
    }
}

/**
 * Close the input selection of the contactlist in editor.
 */
function closeAssignedSelection() {
    const taskOverlayEditorAssignedSelection = document.getElementById('taskOverlayEditorAssignedSelection');
    if (!taskOverlayEditorAssignedSelection.classList.contains('d-none')) {
        taskOverlayEditorAssignedSelection.classList.add('d-none')
    }
}

/**
 * Open the input selection of the contactlist in editor.
 */
function openAssignedSelection() {
    const taskOverlayEditorAssignedSelection = document.getElementById('taskOverlayEditorAssignedSelection');
    taskOverlayEditorAssignedSelection.classList.remove('d-none')
}

/**
 * Change the title of the edited task copy to the editor title input.
 */
function changeTitle() {
    editTask.title = document.getElementById('editorTitleInput').value
}

/**
 * Change the description of the edited task copy to the editor description input
 */
function changeTaskDescription() {
    editTask.description = document.getElementById('editorTaskDescriptionInput').value
}

/**
 * Change the date of the edited task copy to the editor date input.
 */
function changeTaskDate() {
    editTask.dueDate = document.getElementById('editorDateInput').value
}

/**
 * Change the priority of the edited task copy to the editor priority input and apply styling to buttons.
 * @param {string} newPrio 
 * @param {string} buttonID 
 */
function changeTaskPriority(newPrio, buttonID) {
    editTask.priority = newPrio;
    const buttons = document.getElementsByClassName('task-overview-editor-priority-button');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active-priority-button-urgent', 'active-priority-button-medium', 'active-priority-button-low');
    }
    document.getElementById(buttonID).classList.toggle(`active-priority-button-${newPrio}`);
}

/**
 * Add or delete a contact to/from the assigned list of the selected task copy.
 * @param {number} contactId 
 */
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

/**
 * Add the created subtask to the selected tasks copy.
 */
function addSubtask() {
    if (document.getElementById('addSubtaskInput').value.length >= 1) {
        const newSubtask = {
            id: generateNewSubtaskId(),
            description: document.getElementById('addSubtaskInput').value,
            finished: false,
        }
        editTask.subtasks.push(newSubtask)
        document.getElementById('addSubtaskInput').value = '';
        rendertaskOverviewSubtasksList(editTask.subtasks);
    }
}

/**
 * Generates a unqiue id for the new subtask while checking already existing IDs.
 * @returns {number}
 */
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

/**
 * Delete a subtask from the given id of the selcted tasks copy.
 * @param {number} subtaskId 
 */
function deleteSubtask(subtaskId) {
    const subtaskMatchesId = (element) => element.id === subtaskId;
    const subTaskIndex = editTask.subtasks.findIndex(subtaskMatchesId)
    editTask.subtasks.splice(subTaskIndex, 1)
    clearInnerHtml('subtaskEditorContainer')
    rendertaskOverviewSubtasksList(editTask.subtasks);
}

/**
 * Start the subtask editor.
 * @param {number} subtaskId 
 */
function startSubtaskEditing(subtaskId) {
    const subtaskEditorContainer = document.getElementById('subtaskEditorContainer')
    clearInnerHtml('taskOverlaySubtasksList')
    const subtaskMatchesId = (element) => element.id === subtaskId;
    const subTaskIndex = editTask.subtasks.findIndex(subtaskMatchesId)
    const subtask = editTask.subtasks[subTaskIndex]
    subtaskEditorContainer.innerHTML += editorSubtaskEditorTemplate(subtask);
}

/**
 * Change the subtasks description in the copy of the selected task.
 * @param {number} subtaskId 
 */
function changeSubtaskDescription(subtaskId) {
    const editSubtaskInput = document.getElementById('editSubtaskInput')
    const subtaskMatchesId = (element) => element.id === subtaskId;
    const subTaskIndex = editTask.subtasks.findIndex(subtaskMatchesId)
    editTask.subtasks[subTaskIndex].description = editSubtaskInput.value
    clearInnerHtml('subtaskEditorContainer')
    rendertaskOverviewSubtasksList(editTask.subtasks);
}

/**
 * Set the query for filtering the tasks, start the filter function and rendering.
 */
function filterTasks() {
    const query = document.getElementById('boardSearchInput').value
    const filteredTasks = searchTasks(query);
    if (!taskSearchCheck(filteredTasks)) {
        document.getElementById('noTasksFoundInfo').classList.remove('d-none')
    } else if (taskSearchCheck(filteredTasks) && document.getElementById('noTasksFoundInfo')) {
        document.getElementById('noTasksFoundInfo').classList.add('d-none')
    }
    renderfilteredTasks(filteredTasks);
}

/**
 * Filter the task in the board based of the given query value - if no query or an empty query is given, all tasks are beeing rendered.
 * @param {string} query 
 * @returns 
 */
function searchTasks(query) {
    const lowerQuery = query.toLowerCase();
    return taskList
        .map(category => {
            const filteredTasks = category.tasks.filter(task =>
                task.title.toLowerCase().includes(lowerQuery) ||
                (task.description && task.description.toLowerCase().includes(lowerQuery))
            );
            return {
                ...category,
                tasks: filteredTasks
            };
        });
}

/**
 * Checks if filtered tasks has a result or if its empty.
 * @param {*} filteredTasks 
 * @returns {boolean}
 */
function taskSearchCheck(filteredTasks) {
    return filteredTasks.some(list => Array.isArray(list.tasks) && list.tasks.length > 0);

}

/**
 * Clear the inner html of the board and rerender based of the filtered tasks.
 * @param {*} filteredTasks 
 */
function renderfilteredTasks(filteredTasks) {
    const boardContent = document.getElementById('boardContent')
    boardContent.innerHTML = '';
    for (let index = 0; index < filteredTasks.length; index++) {
        const element = filteredTasks[index];
        boardContent.innerHTML += boardColumnTemplate(element, index);
        renderTaskContainer(element.tasks, index);
    }
}

/**
 * Submit the changes from the copy to the actual selected task.
 * @param {number} taskId 
 * @param {number} columnIndex 
 */
async function submitTaskChanges(taskId, columnIndex) {
    const taskMatchesId = (element) => element.id === taskId;
    const taskIndex = taskList[columnIndex].tasks.findIndex(taskMatchesId)
    taskList[columnIndex].tasks[taskIndex] = editTask;
    await updateTaskList();
    await closeTaskOverlay();
}

/**
 * Selete a task from the taskList based of the given taskId and columnIndex.
 * @param {number} taskId 
 * @param {number} columnIndex 
 */
async function deleteTaskFromBoard(taskId, columnIndex) {
    const taskMatchesId = (element) => element.id === taskId;
    const taskIndex = taskList[columnIndex].tasks.findIndex(taskMatchesId)
    taskList[columnIndex].tasks.splice(taskIndex, 1)
    await updateTaskList('Task deleted successfully');
    await closeTaskOverlay();
}