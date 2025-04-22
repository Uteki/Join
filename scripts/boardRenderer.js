let currentDraggedElement;

/**
 * Initialize and render all tasks on the board by loading data and columns.
 * @async
 */
async function renderTasks() {
    await init();
    await renderColumns();
}

/**
 * Render all column containers based on the taskList and populate them with tasks.
 * @async
 */
async function renderColumns() {
    const boardContent = document.getElementById('boardContent');
    clearInnerHtml('boardContent');

    for (let index = 0; index < taskList.length; index++) {
        const column = taskList[index];
        boardContent.innerHTML += boardColumnTemplate(column, index);
        renderTaskContainer(column.tasks, index);
    }
}

/**
 * Render each task within a given column container.
 * @param {Array<Object>} tasks - Array of task objects to render in the column.
 * @param {number} columnIndex - Index of the column in taskList.
 */
function renderTaskContainer(tasks, columnIndex) {
    const container = document.getElementById(`boardColumnTasks${columnIndex}`);

    if (tasks.length > 0) {
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            container.innerHTML += boardTaskTemplate(task, columnIndex);
            renderTaskAssignedTo(task.assignedTo, task.id);
        }
    } else {
        container.innerHTML += boardTaskTemplateEmpty(columnIndex);
    }
}

/**
 * Render the initials of contacts assigned to a task, up to a maximum count, and show excess count.
 * @param {Array<number>} assignedContacts - Array of contact IDs assigned to the task.
 * @param {number} taskId - Unique identifier of the task.
 */
function renderTaskAssignedTo(assignedContacts, taskId) {
    const container = document.getElementById(`boardTaskInvolved${taskId}`);
    const maxDisplay = 4;
    const displayCount = Math.min(assignedContacts.length, maxDisplay);

    for (let i = 0; i < displayCount; i++) {
        const contactId = assignedContacts[i];
        container.innerHTML += boardTaskInitalsTemplate(findContact(contactId));
    }

    if (assignedContacts.length > maxDisplay) {
        const excess = assignedContacts.length - maxDisplay;
        container.innerHTML += `+${excess}`;
    }
}

/**
 * Truncate a task description to 50 characters, appending ellipsis if trimmed.
 * @param {string} description - Full task description.
 * @returns {string} - Truncated description.
 */
function truncateTaskDescription(description) {
    return description.length > 50
        ? description.substring(0, 50) + '...'
        : description;
}

/**
 * Generate HTML for a task priority icon if specified.
 * @param {string|null} prio - Priority level ('urgent', 'medium', or 'low').
 * @returns {string} - HTML string for the priority icon or empty string.
 */
function renderTaskPriority(prio) {
    return prio !== null
        ? boardTaskPriorityTemplate(prio)
        : '';
}

/**
 * Retrieve the string value of a task's priority or empty if none.
 * @param {string|null} prio - Priority level of the task.
 * @returns {string} - Priority string or empty.
 */
function getTaskPriority(prio) {
    return prio !== null ? prio : '';
}

/**
 * Count how many subtasks in a list are marked as finished.
 * @param {Array<Object>} subtasks - Array of subtask objects with boolean `finished`.
 * @returns {number} - Number of finished subtasks.
 */
function finishedTasks(subtasks) {
    return subtasks.filter(sub => sub.finished === true).length;
}

/**
 * Calculate the width (percentage) for the subtask progress bar.
 * @param {Array<Object>} subtasks - Array of subtask objects with boolean `finished`.
 * @returns {string} - Width percentage string (e.g., '50%').
 */
function progressBarWidth(subtasks) {
    const percent = (finishedTasks(subtasks) / subtasks.length) * 100;
    return `${percent}%`;
}

/**
 * Open an overlay displaying full details of a selected task.
 * @param {number} taskId - Unique identifier of the task to open.
 * @param {number} columnIndex - Index of the column containing the task.
 */
function openTaskOverlay(taskId, columnIndex) {
    const body = document.querySelector('body');
    const taskIndex = taskList[columnIndex].tasks.findIndex(t => t.id === taskId);
    const task = taskList[columnIndex].tasks[taskIndex];

    body.innerHTML += boardOverlayTemplate(task, columnIndex);
    renderOverlayAssignedTo(task);
    renderOverlaySubtasks(task, columnIndex, taskIndex);
}

/**
 * Close the task detail overlay and optionally re-render the board.
 * @async
 */
async function closeTaskOverlay() {
    const overlay = document.getElementById('taskOverviewOverlay');
    const addOverlay = document.getElementById('boardAddTaskOverlayContainer');

    if (addOverlay) {
        addOverlay.classList.add('slide-out');
        addOverlay.addEventListener('animationend', async () => {
            addOverlay.classList.remove('slide-out');
            overlay.remove();
            await renderTasks();
        });
    } else {
        overlay.remove();
        await updateTaskList('', true);
        await renderTasks();
    }
}

/**
 * Render the list of contacts assigned to a task in the overlay view.
 * @param {Object} task - Task object containing `assignedTo` array.
 */
function renderOverlayAssignedTo(task) {
    const container = document.getElementById('taskOverviewAssignedContainer');

    for (let i = 0; i < task.assignedTo.length; i++) {
        const contactId = task.assignedTo[i];
        container.innerHTML += overviewAssignedTemplate(findContact(contactId));
    }
}

/**
 * Find a contact object by ID, remove it from any task if not found.
 * @param {number} id - Unique identifier of the contact.
 * @returns {Object|undefined} - Contact object or undefined if removed.
 */
function findContact(id) {
    const idx = contactList.findIndex(c => c.id === id);
    if (idx >= 0) {
        return contactList[idx];
    } else {
        deleteContactFromTask(id);
        renderTasks();
    }
}

/**
 * Render subtasks for a task inside its detail overlay.
 * @param {Object} task - Task object containing subtasks.
 * @param {number} columnIndex - Index of the column in taskList.
 * @param {number} taskIndex - Index of the task within the column.
 */
function renderOverlaySubtasks(task, columnIndex, taskIndex) {
    const container = document.getElementById('taskOverviewSubtasks');

    for (let i = 0; i < task.subtasks.length; i++) {
        const sub = task.subtasks[i];
        container.innerHTML += overviewSubtaskTemplate(sub, columnIndex, taskIndex, i);
    }
}

/**
 * Toggle the finished state of a subtask.
 * @param {number} columnIndex - Index of the column containing the task.
 * @param {number} taskIndex - Index of the task containing the subtask.
 * @param {number} subtaskIndex - Index of the subtask to toggle.
 */
function toggleSubtaskCheckbox(columnIndex, taskIndex, subtaskIndex) {
    const subtask = taskList[columnIndex].tasks[taskIndex].subtasks[subtaskIndex];
    subtask.finished = !subtask.finished;
}