// Contact

function contactTemplate(abbr, name, mail, number, id, color) {
    return `<article>
        <div>
            <div style="background-color: #${color}" class="abbr-profil">${abbr}</div>
            
            <div class="m-left-40">
                <h2 class="m-none m-right-10">${name}</h2>
    
                <div>
                    <button onclick="openModal('edit', ${id}, '${name}', '${mail}', ${number}, '${color}')"><i><img src="../assets/svg/contact-icons/edit.svg" alt="Edit"></i> Edit</button>
                    <button onclick="deleteContact(${id})"><i><img src="../assets/svg/contact-icons/delete.svg" alt="Delete"></i> Delete</button>
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

function contactButtonTemplate(abbr, name, mail ,id, color) {
    return `<button class="button contact-btn" onclick="displayContact(${id})">
        <div style="background-color: #${color}" class="abbr-profil">${abbr}</div>
        
        <div class="m-left-40">
            <span>${name}</span>
            <span>${mail}</span>
        </div>
    </button>
    `
}

function dropdownTemplate(id, name, mail, number, color) {
    return  `<li onclick="openModal('edit', ${id}, '${name}', '${mail}', ${number}, '${color}')"><i><img src="../assets/svg/contact-icons/edit.svg" alt="Edit"></i> Edit</li>
             <li onclick="deleteContact(${id}); toggleContactMenu()"><i><img src="../assets/svg/contact-icons/delete.svg" alt="Delete"></i> Delete</li>
    `
}

function editButtonTemplate(id) {
    return `<button type="button" class="button outline-btn" onclick="deleteContact(${id}); quitModal()">Delete</button>
            <button type="button" class="button dark-bg-btn" onclick="changeContact(${id})">Save<i><img src="../assets/svg/contact-icons/check.svg" alt="Check"></i></button>
    `
}

// Board

function boardColumnTemplate(column, index) {
    return `
        <div class="board-column" id="boardColumn${index}">
            <div class="board-column-header">
                <h2>${column.name}</h2>
                <button type="button" onclick="openAddTaskForm()">+</button>
            </div>
            <div class="board-column-tasks" id="boardColumnTasks${index}" ondrop="dropHandler(event, ${index})" ondragleave="removeHighlightDropArea('boardColumnTasks${index}')" ondragover="allowDrop(event); highlightDropArea('boardColumnTasks${index}')">
            </div>   
        </div>   
        `
}

function boardTaskTemplate(task, columnIndex) {
    return `
        <div class="board-task-container" draggable="true" ondragstart="startDragging(${task.id})" onclick="openTaskOverlay(${task.id}, ${columnIndex})">
            <span class="board-task-category" style="background-color: ${task.category === 'Technical Task' ? 'var(--tec-task-bg)' : 'var(--accent-blue)'};">${task.category}</span>
            <div class="board-task-description">
                <h3 class="board-task-container-title">${task.title}</h3>
                <p>${truncateTaskDescription(task.description)}</p>
            </div>
            
            ${boardTaskProgressTemplate(task.subtasks)}

            <div class="board-task-bottom-container">
                <div class="board-task-involved" id="boardTaskInvolved${task.id}">
                    
                </div>
                ${renderTaskPriority(task.priority)}
            </div>
        </div>
        `
}

function boardTaskProgressTemplate(subtasks) {
    if(subtasks.length > 0){
        return `
            <div class="board-task-progress-container">
                <div class="board-task-progress-bar-container">
                    <div class="board-task-progress-bar" style="width: ${progressBarWidth(subtasks)}"></div>
                </div>
                <span class="board-task-progress">${finishedTasks(subtasks)}/${subtasks.length} Subtasks</span>
            </div>
        `
    } else {
        return `<span></span>`
    }
}

function boardTaskInitalsTemplate(contact) {
    return `
        <div class="board-task-initial" style="background-color: #${contact.color}">${getContactInitials(contact.name)}</div>
    `
}

function boardTaskPriorityTemplate(prio){
    return `
    <img src="../assets/svg/priority-icons/priority-${prio}.svg" alt="">
    `
}

function boardTaskTemplateEmpty(columnIndex) {
    return `
    <div class="board-empty-column">
        No tasks ${taskList[columnIndex].name}
    </div>
`
}

function boardOverlayTemplate(task, columnIndex) {
    return `
    <section class="task-overview-overlay" id="taskOverviewOverlay"  onclick="closeTaskOverlay()">
        <div class="task-overview-container"  id="taskOverviewOverlayContainer" onclick="event.stopPropagation()">
            <div class="task-overview-category">
                <span style="background-color: ${task.category === 'Technical Task' ? 'var(--tec-task-bg)' : 'var(--accent-blue)'};">${task.category}</span>
                <button onclick="closeTaskOverlay()"><img src="../assets/svg/close.svg" alt=""></button>
            </div>
            <h3>
                ${task.title}
            </h3>
            <div class="task-overview-container-content">
                <span class="task-overview-description">${task.description}</span>
                <span class="task-overview-date task-overview-feature">Due Date: <span class="task-overview-due-date">${task.dueDate}</span></span>
                <span class="task-overview-priority task-overview-feature">Priority: <span>${getTaskPriority(task.priority)}<img src="../assets/svg/priority-icons/priority-${task.priority}.svg" alt=""></span></span>
                <div class="task-overview-assigned-container" id="taskOverviewAssignedContainer">
                        <span class="task-overview-feature">Assigned To:</span>

                </div>
                <div class="task-overview-subtasks" id="taskOverviewSubtasks">
                    <span class="task-overview-feature">Subtasks:</span>
                    
                </div>
            </div>
            <div class="task-overview-edit-buttons">
                <button onclick="deleteTaskFromBoard(${task.id}, ${columnIndex})"><img src="../assets/svg/delete.svg">Delete</button>
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
        <div><span class="task-overview-initials" style="background-color: #${contact.color}">${getContactInitials(contact.name)}</span> <span>${contact.name}</span></div>
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
                        <button id="boardEditorUrgentBtn" class="task-overview-editor-priority-button" onclick="changeTaskPriority('urgent', 'boardEditorUrgentBtn')">Urgent<img src="../assets/svg/priority-icons/priority-urgent.svg" alt=""></button>
                        <button id="boardEditorMediumBtn" class="task-overview-editor-priority-button" onclick="changeTaskPriority('medium', 'boardEditorMediumBtn')">Medium<img src="../assets/svg/priority-icons/priority-medium.svg" alt=""></button>
                        <button id="boardEditorLowBtn" class="task-overview-editor-priority-button" onclick="changeTaskPriority('low', 'boardEditorLowBtn')">Low<img src="../assets/svg/priority-icons/priority-low.svg" alt=""></button>
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
                <button onclick="submitTaskChanges(${task.id}, ${columnIndex})">Ok<img src="../assets/svg/summary-icons/check-white.svg" alt=""></button>
            </div>
        </div>
`
}

function assignedListOptionTemplate(contact){
    return `
        <div class="assigned-list-option" onclick="toggleContactToTask(${contact.id})" id="contact${contact.id}"> 
            <div>
                <span class="task-overview-initials" style="background-color: #${contact.color}">${getContactInitials(contact.name)}</span>
                <span>${contact.name}</span>
            </div>
            <input type="checkbox" class="editor-assigned-list-checkbox" id="contactCheckbox${contact.id}">
        </div>
    `
}

function assignedListTemplate(contact){
    return `
        <span class="task-overview-initials" style="background-color: #${contact.color}">${getContactInitials(contact.name)}</span>
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

// add task form template

function boardAddTaskTemplate() {
    return `
    <section class="task-overview-overlay" id="taskOverviewOverlay"  onclick="closeTaskOverlay()">
        <div class="board-add-task-container"  id="boardAddTaskOverlayContainer" onclick="event.stopPropagation(), addTaskCloseAssignedSelection()">
            <div class="board-add-task-header">
                <h1>Add Task</h1>
                <button onclick="closeTaskOverlay()"><img src="../assets/svg/close.svg" alt=""></button>
            </div>
            <form oninput="validateForm()" id="boardAddTaskForm" onsubmit="addNewTask()">
            <div class="board-add-task-form">
                <div class="board-add-task-form-container">
                    <div class="task-overview-feature task-overview-editor-form-content"> <label for="addTaskTitleInput"><span>Titel</span><span class="board-add-tadk-required-icon">*</span></label> <span class="task-overview-due-date"><input required type="text" value="" id="addTaskTitleInput" placeholder="Gib einen Titel ein"></span></div>
                    <div class="task-overview-feature task-overview-editor-form-content"><label for="addTaskDescriptionInput">Description</label><span class="task-overview-due-date"><textarea id="addTaskDescriptionInput" placeholder="Gib eine Beschreibung ein"></textarea></span></div>
                    <div class="task-overview-feature task-overview-editor-form-content"><label for="addTaskDateInput"><span>Due Date</span><span class="board-add-tadk-required-icon">*</span></label><span class="task-overview-due-date"><input required type="date" value="" id="addTaskDateInput"></span></div>
                </div>
                <div class="board-add-task-form-divider">

                </div>
                <div class="board-add-task-form-container">

                    <div class="task-overview-feature task-overview-editor-form-content">Priority
                        <div class="task-overview-priority-buttons">
                            <button type="button" id="addTaskFormUrgentBtn" class="task-overview-editor-priority-button" onclick="setTaskPriority('urgent', 'addTaskFormUrgentBtn')">Urgent<img src="../assets/svg/priority-icons/priority-urgent.svg" alt=""></button>
                            <button type="button" id="addTaskFormMediumBtn" class="task-overview-editor-priority-button" onclick="setTaskPriority('medium', 'addTaskFormMediumBtn')">Medium<img src="../assets/svg/priority-icons/priority-medium.svg" alt=""></button>
                            <button type="button" id="addTaskFormLowBtn" class="task-overview-editor-priority-button" onclick="setTaskPriority('low', 'addTaskFormLowBtn')">Low<img src="../assets/svg/priority-icons/priority-low.svg" alt=""></button>
                        </div>
                    </div>

                    <div class="task-overview-feature task-overview-editor-form-content" onclick="event.stopPropagation()" style="position: relative;">
                            <span class="task-overview-feature">Assigned To</span>
                            <input type="text" class="task-overlay-editor-assigned-selection" placeholder="Select contacts to assign" onfocus="openBoardAddTaskAssignedSelection()" oninput="boardAddTaskFilterContacts()" id="boardAddTaskContactQueryInput">
                            <div id="boardAddTaskAssignedSelection" class="task-overlay-editor-assigned-selection d-none" style="position:absolute; top:95px; background-color: white; width: 100%; z-index: 100;">

                            </div>
                            <div id="boardAddTaskAssignedContacts" class="task-overlay-editor-assigned-contacts">

                            </div>
                    </div>

                    <div class="task-overview-feature task-overview-editor-form-content">
                        <label for="boardAddTaskCategoryInput"><span>Category</span><span class="board-add-tadk-required-icon">*</span></label>
                        <select name="category" id="boardAddTaskCategoryInput" required>
                            <option value="" selected>Please choose a category</option>
                            <option value="Technical Task">Technical Task</option>
                            <option value="User Story">User Story</option>
                          </select>
                    </div>

                    <div class="task-overview-feature task-overview-editor-form-content" id="boardAddTaskSubtasks">
                        <span class="task-overview-feature">Subtasks</span>
                        <div class="task-overlay-editor-add-subtask"><input type="text" placeholder="Add new subtask" id="addSubtaskInput"/><button type="button" onclick="createSubtaskToNewTask()">+</button></div>
                        <div id="subtaskEditorContainer">

                        </div>
                        
                        <ul id="boardAddTaskSubtasksList" class="board-add-task-subtask-list">

                        </ul>

                    </div>
                </div>
            </div>
            <div class="board-add-task-bottom-buttons">
                <button type="button" onclick="closeTaskOverlay()" class="board-add-task-cancel-button">Cancel<img src="../assets/svg/close.svg" alt=""></button>
                <button type="submit" id="boardAddTaskSubmitButton" class="board-add-task-submit-button" disabled>Create Task<img src="../assets/svg/summary-icons/check-white.svg" alt=""></button>
            </div>
            </form>
        </div>
    </section>
`
}


function addTaskAssignedListOptionTemplate(contact){
    return `
        <div class="assigned-list-option" onclick="toggleContactToAddTask(${contact.id})" id="contact${contact.id}"> 
            <div>
                <span class="task-overview-initials" style="background-color: #${contact.color}">${getContactInitials(contact.name)}</span>
                <span>${contact.name}</span>
            </div>
            <input type="checkbox" class="editor-assigned-list-checkbox" id="contactCheckbox${contact.id}">
        </div>
    `
}

function addTaskAssignedListTemplate(contact){
    return `
        <span class="task-overview-initials" style="background-color: #${contact.color}">${getContactInitials(contact.name)}</span>
    `
}

function addTaskSubtaskListTemplate(subtask){
    return `
        <li>
            <div class="task-overlay-editor-subtask">
                ${subtask.description}
                <div class="task-overlay-editor-subtask-buttons">
                    <button type="button" onclick="addTaskStartSubtaskEditing(${subtask.id})"><img src="../assets/svg/summary-icons/edit-dark.svg"></button>
                        <span></span>
                    <button type="button" onclick="addTaskDeleteSubtask(${subtask.id})"><img src="../assets/svg/delete.svg"></button>
                </div>
            </div>
        </li>
    `
}

function addTaskSubtaskEditorTemplate(subtask){
    return `
        <div class="task-subtask-editor">
        <input type="text" value="${subtask.description}" id="editSubtaskInput"/>
            <div class="task-subtask-editor-buttons">
                <button onclick="addTaskDeleteSubtask(${subtask.id})"><img src="../assets/svg/delete.svg"></button>
                    <span></span>
                <button onclick="addTaskChangeSubtaskDescription(${subtask.id})"><img src="../assets/svg/summary-icons/check-dark.svg"></button>
            </div>
        </div>
    `
}
