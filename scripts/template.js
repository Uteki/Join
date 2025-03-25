// Contact

function contactTemplate (abbr, name, mail, number) {
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

function addAbbreviation (letter) {
    return `<div>
        <h5>${letter}</h5>
    </div>
    `
}

function contactButtonTemplate (abbr, name, mail) {
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

function boardColumnTemplate (column, index){
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

function boardTaskTemplate (task, columnIndex){
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
                <img src="../assets/svg/Property 1=${task.priority}.svg" alt="">
            </div>
        </div>
        `
}

function boardTaskInitalsTemplate(contact){
    return `
        <div class="board-task-initial">${getContactInitials(contact.name)}</div>
    `
}

function boardTaskTemplateEmpty(){
    return `
    <div class="board-empty-column">
        No tasks To do
    </div>
`
}

function boardOverlayTemplate(task){
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
            <span class="task-overview-priority task-overview-feature">Priority: <span>${task.priority} <img src="../assets/svg/Property 1=${task.priority}.svg" alt=""></span></span>
            <div class="task-overview-assigned-container" id="taskOverviewAssignedContainer">
                	<span class="task-overview-feature">Assigned To:</span>

            </div>
            <div class="task-overview-subtasks" id="taskOverviewSubtasks">
                <span class="task-overview-feature">Subtasks:</span>
                
            </div>
            <div class="task-overview-edit-buttons">
                <button><img src="../assets/svg/delete.svg" alt="">Delete</button>
                <div class="task-overview-divider"></div>
                <button><img src="../assets/svg/summary-icons/edit-dark.svg" alt="">Edit</button>
            </div>
        </div>
    </section>
`
}

// user implementation is missing
function overviewAssignedTemplate(contact){
    return `
        <div><span class="task-overview-initials">${getContactInitials(contact.name)}</span> <span>${contact.name}</span></div>
`
}

function overviewSubtaskTemplate(subtask, columnIndex, taskIndex, subtaskIndex){
    return `
        <div>
            <input type="checkbox" id="subtask${subtask.id}" ${subtask.finished ? "checked" : ""} onclick="toggleSubtaskCheckbox(${columnIndex}, ${taskIndex}, ${subtaskIndex})">
            <label for="subtask${subtask.id}">${subtask.description}</label>
        </div>
`
}