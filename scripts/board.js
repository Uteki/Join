let currentDraggedElement;
let filteredTasks = [];
let editTask;

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

function getTaskPriority(prio) {
    if (prio !== null) {
        return prio;
    } else {
        return '';
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
    await updateTaskList(null);
    renderTasks();
}

function highlightDropArea(id) {
    document.getElementById(`${id}`).classList.add('drag-area-highlight')
}

function removeHighlightDropArea(id) {
    document.getElementById(`${id}`).classList.remove('drag-area-highlight')
}

// Touch Drag and Drop

const scrollThreshold = 100; // Bereich (in Pixel) am oberen/unteren Rand, in dem das Auto-Scrollen aktiviert wird
const scrollSpeed = 10;     // Scroll-Geschwindigkeit (Pixel pro Event-Aufruf)

// Schwellenwert für den Long-Touch in Millisekunden
const longPressThreshold = 2000;

// Globale Variable zum Speichern des aktuell "gezogenen" Elements (Task-ID)
// let currentTouchDraggedElement = null;

// Wird aufgerufen, wenn der Benutzer den Finger auf ein Task-Element legt
function mobileTouchStart(event, taskId) {
    event.preventDefault();
    
    // Setze globalen Wert des aktuell "gezogen" Elements
    startDragging(taskId);
    
    // Über das Event-Target (das Task-Element) wird der Timer gespeichert
    event.currentTarget.longPressTimeout = setTimeout(() => {
        // Visual: Z. B. Hinweis, dass der Drag-Modus aktiv ist
        event.currentTarget.classList.add('dragging');
        // (Optional) Hier kannst du weitere Logik zum „visuellen Start“ des Drag-Prozesses einbauen
    }, longPressThreshold);
}

// Wird aufgerufen, sobald sich der Finger bewegt
function mobileTouchMove(event, taskId) {
    event.preventDefault();
    const target = event.currentTarget;
    
    // Falls der Timer noch aktiv ist, abbrechen
    if (target.longPressTimeout) {
        clearTimeout(target.longPressTimeout);
        target.longPressTimeout = null;
    }
    
    // Ermittle über die Touchposition die darunter liegende Drop-Zone:
    const touch = event.touches[0];
    target.style.position = 'fixed'
    target.style.left = touch.pageX + 'px'
    target.style.top = touch.pageY + 'px'
    const dropZoneElement = document.elementFromPoint(touch.clientX, touch.clientY);
    
    // Entferne zunächst alle Highlight-Effekte von vorhandenen Drop-Zonen
    const dropZones = document.getElementsByClassName('board-column-tasks');
    Array.from(dropZones).forEach(zone => zone.classList.remove('drag-area-highlight'));
    
    // Überprüfe, ob die unter der Fingerposition befindliche Zone eine gültige Drop-Zone ist.
    if (dropZoneElement) {
        // Suche über closest() nach einer übergeordneten Box, die als Drop-Zone definiert ist.
        const validDropZone = dropZoneElement.closest('.board-column-tasks');
        if (validDropZone) {
            validDropZone.classList.add('drag-area-highlight');
        }
    }
    // --- Auto-Scroll Logik ---
    // Prüfe, ob sich der Finger im oberen oder unteren Bereich des Viewports befindet und scrolle entsprechend.
    const container = document.getElementById('boardContent')
    if (touch.clientY < scrollThreshold) {
        // Scrollen nach oben
        container.scrollBy(0, -scrollSpeed);
    } else if (touch.clientY > (window.innerHeight - scrollThreshold)) {
        // Scrollen nach unten
        container.scrollBy(0, scrollSpeed);
    }
}

// Wird aufgerufen, wenn der Finger vom Screen abhebt
function mobileTouchEnd(event, taskId) {
    event.preventDefault();
    const target = event.currentTarget;
    
    // Falls der Timer noch aktiv ist, abbrechen
    if (target.longPressTimeout) {
        clearTimeout(target.longPressTimeout);
        target.longPressTimeout = null;
    }
    
    // Entferne den "dragging"-State vom Task
    target.classList.remove('dragging');
    
    // Ermittle die Position, an der der Finger den Screen verlassen hat
    const touch = event.changedTouches[0];
    const dropZoneElement = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (dropZoneElement) {
        const validDropZone = dropZoneElement.closest('.board-column-tasks');
        if (validDropZone) {
            // Extrahiere die Spalten-ID bzw. den Index aus der ID-Notation des Elements,
            // z. B. "boardColumnTasks2" -> Index 2
            const zoneId = validDropZone.getAttribute('id');
            const targetColumnIndex = parseInt(zoneId.replace('boardColumnTasks', ''));
            // Entferne auch den Highlight-Effekt
            removeHighlightDropArea(zoneId);
            // Führe den Drop (Verschiebe-Vorgang) aus
            moveTaskToColumn(currentDraggedElement, targetColumnIndex);
        }
    }
    
    // Entferne Highlight-Effekte von allen Drop-Zonen
    const dropZones = document.getElementsByClassName('board-column-tasks');
    Array.from(dropZones).forEach(zone => zone.classList.remove('drag-area-highlight'));
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
    const taskOverviewOverlay = document.getElementById('taskOverviewOverlay')
    const boardAddTaskOverlayContainer = document.getElementById('boardAddTaskOverlayContainer')
    if (boardAddTaskOverlayContainer) {
        boardAddTaskOverlayContainer.classList.add('slide-out');
        boardAddTaskOverlayContainer.addEventListener('animationend', async () => {
            boardAddTaskOverlayContainer.classList.remove('slide-out');
            taskOverviewOverlay.remove()
            renderTasks();
        });
    } else {
        taskOverviewOverlay.remove()
        renderTasks();
    }
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
    if (document.getElementById('addSubtaskInput').value.length >= 4) {
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
    if (!taskSearchCheck(filteredTasks)) {
        document.getElementById('noTasksFoundInfo').classList.remove('d-none')
    } else if (taskSearchCheck(filteredTasks) && document.getElementById('noTasksFoundInfo')){
        document.getElementById('noTasksFoundInfo').classList.add('d-none')
    }
    renderfilteredTasks(filteredTasks);
}

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

function taskSearchCheck(filteredTasks) {
    return filteredTasks.some(list => Array.isArray(list.tasks) && list.tasks.length > 0);

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

async function submitTaskChanges(taskId, columnIndex) {
    const taskMatchesId = (element) => element.id === taskId;
    const taskIndex = taskList[columnIndex].tasks.findIndex(taskMatchesId)
    taskList[columnIndex].tasks[taskIndex] = editTask;
    await updateTaskList();
    closeTaskOverlay();
}

async function deleteTaskFromBoard(taskId, columnIndex) {
    const taskMatchesId = (element) => element.id === taskId;
    const taskIndex = taskList[columnIndex].tasks.findIndex(taskMatchesId)
    taskList[columnIndex].tasks.splice(taskIndex, 1)
    await updateTaskList('Task deleted successfully');
    closeTaskOverlay();
}




