let filteredTasks = [];
let editTask;
/**
 * Enter edit mode for a task in the detail overlay.
 * @param {number} taskId - Unique identifier of the task to edit.
 * @param {number} columnIndex - Index of the column containing the task.
 * @async
 */
async function startOverlayEditor(taskId, columnIndex) {
    const overlayContainer = document.getElementById('taskOverviewOverlayContainer');
    overlayContainer.remove();
    createTaskCopy(taskId, columnIndex);
    renderOverlayEditor(taskId, columnIndex);
}

/**
 * Create a deep copy of a task for editing purposes.
 * @param {number} taskId - ID of the task to copy.
 * @param {number} columnIndex - Index of the column containing the task.
 */
function createTaskCopy(taskId, columnIndex) {
    const idx = taskList[columnIndex].tasks.findIndex(t => t.id === taskId);
    editTask = JSON.parse(JSON.stringify(taskList[columnIndex].tasks[idx]));
}

/**
 * Render the HTML for the task editor within the overlay.
 * @param {number} taskId - ID of the task to edit.
 * @param {number} columnIndex - Index of the column containing the task.
 */
function renderOverlayEditor(taskId, columnIndex) {
    const overlay = document.getElementById('taskOverviewOverlay');
    const idx = taskList[columnIndex].tasks.findIndex(t => t.id === taskId);
    const task = taskList[columnIndex].tasks[idx];

    overlay.innerHTML += boardOverlayEditorTemplate(task, columnIndex);
    renderOverlayEditorAssigned(contactList);
    rendertaskOverviewSubtasksList(task.subtasks);
    changeTaskPriority(editTask.priority, `boardEditor${firstLetterToUpperCase(editTask.priority)}Btn`);
}

/**
 * Populate the editor contact selection list and mark already assigned contacts.
 * @param {Array<Object>} contactsToRender - Array of contact objects.
 */
function renderOverlayEditorAssigned(contactsToRender) {
    const selection = document.getElementById('taskOverlayEditorAssignedSelection');
    clearInnerHtml('taskOverlayEditorAssignedSelection');

    contactsToRender.forEach(c => {
        selection.innerHTML += assignedListOptionTemplate(c);
    });
    contactsToRender.forEach(c => checkIfContactIsAssigned(c));
    rendertaskOverlayEditorAssignedContacts();
}

/**
 * Display initials of contacts assigned to the task copy in the editor.
 */
function rendertaskOverlayEditorAssignedContacts() {
    const container = document.getElementById('taskOverlayEditorAssignedContacts');
    clearInnerHtml('taskOverlayEditorAssignedContacts');

    const maxShow = 4;
    const showCount = Math.min(editTask.assignedTo.length, maxShow);

    for (let i = 0; i < showCount; i++) {
        container.innerHTML += assignedListTemplate(findContact(editTask.assignedTo[i]));
    }

    if (editTask.assignedTo.length > maxShow) {
        const excess = editTask.assignedTo.length - maxShow;
        container.innerHTML += `+${excess}`;
    }
}

/**
 * Toggle visual selection state of a contact in the editor list based on assignment.
 * @param {Object} contact - Contact object to check.
 */
function checkIfContactIsAssigned(contact) {
    const isAssigned = editTask.assignedTo.includes(contact.id);
    const element = document.getElementById(`contact${contact.id}`);
    const checkbox = document.getElementById(`contactCheckbox${contact.id}`);

    if (isAssigned) {
        element.classList.add('assigned-list-option-selected');
        element.classList.remove('assigned-list-option');
        checkbox.checked = true;
    }
}

/**
 * Filter displayed contacts in the editor based on search input.
 */
function filterContacts() {
    const query = document.getElementById('editorContactQueryInput').value;
    const filtered = searchContacts(query);
    renderOverlayEditorAssigned(filtered);
}

/**
 * Search contacts by name substring ignoring case.
 * @param {string} query - Search string entered by user.
 * @returns {Array<Object>} - Array of matching contact objects.
 */
function searchContacts(query) {
    const lower = query.toLowerCase();
    return contactList.filter(c => c.name.toLowerCase().includes(lower));
}

/**
 * Render the list of subtasks in the editor overview section.
 * @param {Array<Object>} subtasks - Array of subtask objects.
 */
function rendertaskOverviewSubtasksList(subtasks) {
    const listContainer = document.getElementById('taskOverlaySubtasksList');
    clearInnerHtml('taskOverlaySubtasksList');

    subtasks.forEach(sub => {
        listContainer.innerHTML += editorSubtaskListTemplate(sub);
    });
}

/**
 * Hide the contact selection dropdown in the editor.
 */
function closeAssignedSelection() {
    const sel = document.getElementById('taskOverlayEditorAssignedSelection');
    if (!sel.classList.contains('d-none')) {
        sel.classList.add('d-none');
    }
}

/**
 * Show the contact selection dropdown in the editor.
 */
function openAssignedSelection() {
    document.getElementById('taskOverlayEditorAssignedSelection').classList.remove('d-none');
}

/**
 * Update the title of the task copy based on editor input field.
 */
function changeTitle() {
    editTask.title = document.getElementById('editorTitleInput').value;
}

/**
 * Update the description of the task copy based on editor input field.
 */
function changeTaskDescription() {
    editTask.description = document.getElementById('editorTaskDescriptionInput').value;
}

/**
 * Update the due date of the task copy based on editor input field.
 */
function changeTaskDate() {
    editTask.dueDate = document.getElementById('editorDateInput').value;
}

/**
 * Update the priority of the task copy and visually highlight the selected button.
 * @param {string} newPrio - New priority level to assign.
 * @param {string} buttonID - DOM element ID of the button to highlight.
 */
function changeTaskPriority(newPrio, buttonID) {
    editTask.priority = newPrio;
    const buttons = document.getElementsByClassName('task-overview-editor-priority-button');
    Array.from(buttons).forEach(btn => {
        btn.classList.remove('active-priority-button-urgent', 'active-priority-button-medium', 'active-priority-button-low');
    });
    document.getElementById(buttonID).classList.toggle(`active-priority-button-${newPrio}`);
}

/**
 * Toggle assignment of a contact in the task copy and update display.
 * @param {number} contactId - ID of the contact to add or remove.
 */
function toggleContactToTask(contactId) {
    const input = document.getElementById('editorContactQueryInput');
    if (editTask.assignedTo.includes(contactId)) {
        const idx = editTask.assignedTo.findIndex(id => id === contactId);
        editTask.assignedTo.splice(idx, 1);
    } else {
        editTask.assignedTo.push(contactId);
    }
    input.value = '';
    renderOverlayEditorAssigned(contactList);
}

/**
 * Add a new subtask to the task copy if input is non-empty.
 */
function addSubtask() {
    const input = document.getElementById('addSubtaskInput');
    if (input.value.trim().length >= 1) {
        const newSubtask = {
            id: generateNewSubtaskId(),
            description: input.value,
            finished: false
        };
        editTask.subtasks.push(newSubtask);
        input.value = '';
        rendertaskOverviewSubtasksList(editTask.subtasks);
    }
}

/**
 * Generate a unique numeric ID for a new subtask within the task copy.
 * @returns {number} - New unique subtask ID.
 */
function generateNewSubtaskId() {
    const existing = new Set(editTask.subtasks.map(s => s.id));
    let newId = 0;
    while (existing.has(newId)) newId++;
    return newId;
}

/**
 * Remove a subtask from the task copy by ID and update the editor list.
 * @param {number} subtaskId - ID of the subtask to delete.
 */
function deleteSubtask(subtaskId) {
    const idx = editTask.subtasks.findIndex(s => s.id === subtaskId);
    if (idx >= 0) editTask.subtasks.splice(idx, 1);
    clearInnerHtml('subtaskEditorContainer');
    rendertaskOverviewSubtasksList(editTask.subtasks);
}

/**
 * Begin editing a specific subtask in the editor.
 * @param {number} subtaskId - ID of the subtask to edit.
 */
function startSubtaskEditing(subtaskId) {
    const container = document.getElementById('subtaskEditorContainer');
    clearInnerHtml('taskOverlaySubtasksList');
    const idx = editTask.subtasks.findIndex(s => s.id === subtaskId);
    const subtask = editTask.subtasks[idx];
    container.innerHTML += editorSubtaskEditorTemplate(subtask);
}

/**
 * Save edits to a subtask's description and refresh the editor list.
 * @param {number} subtaskId - ID of the subtask being edited.
 */
function changeSubtaskDescription(subtaskId) {
    const input = document.getElementById('editSubtaskInput');
    const idx = editTask.subtasks.findIndex(s => s.id === subtaskId);
    if (idx >= 0) editTask.subtasks[idx].description = input.value;
    clearInnerHtml('subtaskEditorContainer');
    rendertaskOverviewSubtasksList(editTask.subtasks);
}

/**
 * Filter tasks on the board by title or description substring.
 */
function filterTasks() {
    const query = document.getElementById('boardSearchInput').value;
    const results = searchTasks(query);
    const noResult = document.getElementById('noTasksFoundInfo');
    if (!taskSearchCheck(results)) {
        noResult.classList.remove('d-none');
    } else if (noResult) {
        noResult.classList.add('d-none');
    }
    renderfilteredTasks(results);
}

/**
 * Search through all tasks for those matching the query.
 * @param {string} query - Case-insensitive search term.
 * @returns {Array<Object>} - New taskList structure with filtered tasks arrays.
 */
function searchTasks(query) {
    const lower = query.toLowerCase();
    return taskList.map(category => ({
        ...category,
        tasks: category.tasks.filter(task =>
            task.title.toLowerCase().includes(lower) ||
            (task.description && task.description.toLowerCase().includes(lower))
        )
    }));
}

/**
 * Check if any column in the filtered tasks result contains at least one task.
 * @param {Array<Object>} filteredTasks - Output from searchTasks function.
 * @returns {boolean} - True if at least one task found, false otherwise.
 */
function taskSearchCheck(filteredTasks) {
    return filteredTasks.some(col => Array.isArray(col.tasks) && col.tasks.length > 0);
}

/**
 * Clear the board and re-render columns and tasks based on filtered results.
 * @param {Array<Object>} filteredTasks - Array of column objects with tasks to display.
 */
function renderfilteredTasks(filteredTasks) {
    const boardContent = document.getElementById('boardContent');
    boardContent.innerHTML = '';
    filteredTasks.forEach((column, idx) => {
        boardContent.innerHTML += boardColumnTemplate(column, idx);
        renderTaskContainer(column.tasks, idx);
    });
}

/**
 * Apply changes from the edited task copy back to the main taskList and close the editor.
 * @param {number} taskId - ID of the task being submitted.
 * @param {number} columnIndex - Index of the column containing the task.
 * @async
 */
async function submitTaskChanges(taskId, columnIndex) {
    const idx = taskList[columnIndex].tasks.findIndex(t => t.id === taskId);
    taskList[columnIndex].tasks[idx] = editTask;
    await updateTaskList();
    await closeTaskOverlay();
}

/**
 * Delete a task from the board and refresh the view.
 * @param {number} taskId - ID of the task to remove.
 * @param {number} columnIndex - Index of the column containing the task.
 * @async
 */
async function deleteTaskFromBoard(taskId, columnIndex) {
    const idx = taskList[columnIndex].tasks.findIndex(t => t.id === taskId);
    taskList[columnIndex].tasks.splice(idx, 1);
    await updateTaskList('Task deleted successfully');
    await closeTaskOverlay();
}