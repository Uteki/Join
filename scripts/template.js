// Contact

function contactTemplate(abbr, name, mail, number) {
    return `<article>
        <div>
            <div>${abbr}</div>
            
            <div class="m-left-40">
                <h2 class="m-none m-right-40">${name}</h2>
    
                <div>
                    <button onclick="editContact()"><i><img src="../assets/svg/contact-icons/edit.svg" alt="Edit"></i> Edit</button>
                    <button onclick="deleteContact()"><i><img src="../assets/svg/contact-icons/delete.svg" alt="Delete"></i> Delete</button>
                </div>
            </div>
        </div>
        
        <p>Contact Information</p>
        
        <p class="w-bold">Email</p>
        <p><a href="mailto:${mail}">${mail}</a></p>
        
        <p class="w-bold">Phone</p>
        <p><a href="tel:+${number}">+${number}</a></p>
    </article>
    `
}

function addAbbreviation(letter) {
    return `<div>
        <h5>${letter}</h5>
    </div>
    `
}

function contactButtonTemplate(abbr, name, mail) {
    return `<button class="button contact-btn">
        <div class="abbr-profil">${abbr}</div>
        
        <div class="m-left-40">
            <span>${name}</span>
            <span>${mail}</span>
        </div>
    </button>
    `
}

// Board

function boardColumnTemplate(column, index) {
    return `
        <div class="board-column" id="boardColumn${index}">
            <div class="board-column-header">
                <h2>${column.name}</h2>
                <button type="button">+</button>
            </div>
            <div class="board-column-tasks" id="boardColumnTasks${index}" ondrop="dropHandler(event, ${index})" ondragover="allowDrop(event)">
            </div>   
        </div>   
        `
}

function boardTaskTemplate(task, columnIndex) {
    return `
        <div class="board-task-container" draggable="true" ondragstart="startDragging(${task.id})" onclick="openTaskOverlay(${task.id}, ${columnIndex})">
            <span class="board-task-category">${task.category}</span>
            <div class="board-task-description">
                <h3 class="board-task-container-title">${task.title}</h3>
                <p>${task.description}</p>
            </div>
            <div class="board-task-progress-container">
                <div class="board-task-progress-bar-container">
                    <div class="board-task-progress-bar" style="width: ${progressBarWidth(task.subtasks)}"></div>
                </div>
                <span class="board-task-progress">${finishedTasks(task.subtasks)}/${task.subtasks.length} Subtasks</span>
            </div>
            <div class="board-task-bottom-container">
                <div class="board-task-involved" id="boardTaskInvolved${task.id}">
                    
                </div>
                <img src="../assets/svg/priority-icons/priority-${task.priority}.svg" alt="">
            </div>
        </div>
        `
}

function boardTaskInitalsTemplate(contact) {
    return `
        <div class="board-task-initial">${getContactInitials(contact.name)}</div>
    `
}

function boardTaskTemplateEmpty() {
    return `
    <div class="board-empty-column">
        No tasks To do
    </div>
`
}

function boardOverlayTemplate(task, columnIndex) {
    return `
    <section class="task-overview-overlay" id="taskOverviewOverlay"  onclick="closeTaskOverlay()">
        <div class="task-overview-container"  id="taskOverviewOverlayContainer" onclick="event.stopPropagation()">
            <div class="task-overview-category">
                <span>${task.category}</span>
                <button onclick="closeTaskOverlay()"><img src="../assets/svg/close.svg" alt=""></button>
            </div>
            <h3>
                ${task.title}
            </h3>
            <span class="task-overview-description">${task.description}</span>
            <span class="task-overview-date task-overview-feature">Due Date: <span class="task-overview-due-date">${task.dueDate}</span></span>
            <span class="task-overview-priority task-overview-feature">Priority: <span>${task.priority} <img src="../assets/svg/priority-icons/priority-${task.priority}.svg" alt=""></span></span>
            <div class="task-overview-assigned-container" id="taskOverviewAssignedContainer">
                	<span class="task-overview-feature">Assigned To:</span>

            </div>
            <div class="task-overview-subtasks" id="taskOverviewSubtasks">
                <span class="task-overview-feature">Subtasks:</span>
                
            </div>
            <div class="task-overview-edit-buttons">
                <button><img src="../assets/svg/delete.svg" alt="">Delete</button>
                <div class="task-overview-divider"></div>
                <button onclick="startOverlayEditor(${task.id}, ${columnIndex})"><img src="../assets/svg/summary-icons/edit-dark.svg" alt="">Edit</button>
            </div>
        </div>
    </section>
`
}

// user implementation is missing
function overviewAssignedTemplate(contact) {
    return `
        <div><span class="task-overview-initials">${getContactInitials(contact.name)}</span> <span>${contact.name}</span></div>
`
}

function overviewSubtaskTemplate(subtask, columnIndex, taskIndex, subtaskIndex) {
    return `
        <div>
            <input type="checkbox" id="subtask${subtask.id}" ${subtask.finished ? "checked" : ""} onclick="toggleSubtaskCheckbox(${columnIndex}, ${taskIndex}, ${subtaskIndex})">
            <label for="subtask${subtask.id}">${subtask.description}</label>
        </div>
`
}

// board task editor 
function boardOverlayEditorTemplate(task, columnIndex) {
    return `
        <div class="task-overview-container"  id="taskEditorOverlayContainer" onclick="event.stopPropagation(), closeAssignedSelection()">
            <div class="task-overview-category">
                <div></div>
                <button onclick="closeTaskOverlay()"><img src="../assets/svg/close.svg" alt=""></button>
            </div>
            <div class="task-overlay-editor-form">
                <div class="task-overview-feature task-overview-editor-form-content">Titel <span class="task-overview-due-date"><input type="text" value="${task.title}" id="editorTitleInput" oninput="changeTitle()"></span></div>
                <div class="task-overview-feature task-overview-editor-form-content">Description<span class="task-overview-due-date"><textarea id="editorTaskDescriptionInput" oninput="changeTaskDescription()">${task.description}</textarea></span></div>
                <div class="task-overview-feature task-overview-editor-form-content">Due Date<span class="task-overview-due-date"><input type="date" value="${task.dueDate}" id="editorDateInput" oninput="changeTaskDate()"></span></div>
                <div class="task-overview-feature task-overview-editor-form-content">Priority
                    <div class="task-overview-priority-buttons">
                        <button class="task-overview-editor-priority-button" onclick="changeTaskPriority('urgent')">Urgent<img src="../assets/svg/priority-icons/priority-urgent.svg" alt=""></button>
                        <button class="task-overview-editor-priority-button" onclick="changeTaskPriority('medium')">Medium<img src="../assets/svg/priority-icons/priority-medium.svg" alt=""></button>
                        <button class="task-overview-editor-priority-button" onclick="changeTaskPriority('low')">Low<img src="../assets/svg/priority-icons/priority-low.svg" alt=""></button>
                    </div>
                </div>

                <div class="task-overview-feature task-overview-editor-form-content" onclick="event.stopPropagation()">
                        <span class="task-overview-feature">Assigned To</span>
                        <input type="text" class="task-overlay-editor-assigned-selection" placeholder="Select contacts to assign" onfocus="openAssignedSelection()" oninput="filterContacts()" id="editorContactQueryInput">
                        <div id="taskOverlayEditorAssignedSelection" class="task-overlay-editor-assigned-selection d-none">

                        </div>
                        <div id="taskOverlayEditorAssignedContacts" class="task-overlay-editor-assigned-contacts">

                        </div>

                </div>
                <div class="task-overview-feature task-overview-editor-form-content" id="taskOverviewSubtasks">
                    <span class="task-overview-feature">Subtasks:</span>
                    <div class="task-overlay-editor-add-subtask"><input type="text" placeholder="Add new subtask" id="addSubtaskInput"/><button onclick="addSubtask(${task.id}, ${columnIndex})">+</button></div>
                    <div id="subtaskEditorContainer">

                    </div>
                    
                    <ul id="taskOverlaySubtasksList" class="task-overlay-subtask-list">

                    </ul>

                </div>
            </div>
            <div class="task-overlay-editor-confirm-button">
                <button>Ok<img src="../assets/svg/summary-icons/check-white.svg" alt=""></button>
            </div>
        </div>
`
}

function assignedListOptionTemplate(contact){
    return `
        <div class="assigned-list-option" onclick="toggleContactToTask(${contact.id})" id="contact${contact.id}"> 
            <div>
                <span class="task-overview-initials">${getContactInitials(contact.name)}</span>
                <span>${contact.name}</span>
            </div>
            <input type="checkbox" class="editor-assigned-list-checkbox" id="contactCheckbox${contact.id}">
        </div>
    `
}

function assignedListTemplate(contact){
    return `
        <span class="task-overview-initials">${getContactInitials(contact.name)}</span>
    `
}

function editorSubtaskListTemplate(subtask){
    return `
        <li>
            <div class="task-overlay-editor-subtask">
                ${subtask.description}
                <div class="task-overlay-editor-subtask-buttons">
                    <button onclick="startSubtaskEditing(${subtask.id})"><img src="../assets/svg/summary-icons/edit-dark.svg"></button>
                        <span></span>
                    <button onclick="deleteSubtask(${subtask.id})"><img src="../assets/svg/delete.svg"></button>
                </div>
            </div>
        </li>
    `
}

function editorSubtaskEditorTemplate(subtask){
    return `
        <div class="task-subtask-editor">
        <input type="text" value="${subtask.description}" id="editSubtaskInput"/>
            <div class="task-subtask-editor-buttons">
                <button onclick="deleteSubtask(${subtask.id})"><img src="../assets/svg/delete.svg"></button>
                    <span></span>
                <button onclick="changeSubtaskDescription(${subtask.id})"><img src="../assets/svg/summary-icons/check-dark.svg"></button>
            </div>
        </div>
    `
}