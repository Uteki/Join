let currentDraggedElement;

// Render functions

async function renderTasks() {
    await init();
    await renderColumns();
}

async function renderColumns() {
    const boardContent = document.getElementById('boardContent')
    boardContent.innerHTML = '';
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
        boardColumnTasks.innerHTML += boardTaskTemplateEmpty();
    }
}

function renderTaskAssignedTo(assignedContacts, id){
    const boardTaskInvolved = document.getElementById(`boardTaskInvolved${id}`)
    for (let index = 0; index < assignedContacts.length; index++) {
        const element = assignedContacts[index];
        boardTaskInvolved.innerHTML += boardTaskInitalsTemplate(findContact(element));
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
    let sourceColumnIndex = null;
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

// Overlay
function openTaskOverlay(taskId, columnIndex){
    const body = document.querySelector('body')
    const taskMatchesId = (element) => element.id === taskId;
    const taskIndex = taskList[columnIndex].tasks.findIndex(taskMatchesId)
    const task = taskList[columnIndex].tasks[taskIndex]
    body.innerHTML += boardOverlayTemplate(task);
    renderOverlayAssignedTo(task);
    renderOverlaySubtasks(task, columnIndex, taskIndex);
}

async function closeTaskOverlay(){
    const taskOverviewOverlay = document.getElementById('taskOverviewOverlay')
    taskOverviewOverlay.remove()
    await updateTaskList();
    renderTasks();
}

function renderOverlayAssignedTo(task){
    const taskOverviewAssignedContainer = document.getElementById('taskOverviewAssignedContainer')
    for (let index = 0; index < task.assignedTo.length; index++) {
        const element = task.assignedTo[index];
        taskOverviewAssignedContainer.innerHTML += overviewAssignedTemplate(findContact(element));
    }
};

function findContact(id){
    const contactIndex = contactList.findIndex((element) => element.id === id);
    return contactList[contactIndex] 
}

function renderOverlaySubtasks(task, columnIndex, taskIndex){
    const taskOverviewSubtasks = document.getElementById('taskOverviewSubtasks')
    for (let index = 0; index < task.subtasks.length; index++) {
        const element = task.subtasks[index];
        taskOverviewSubtasks.innerHTML += overviewSubtaskTemplate(element, columnIndex, taskIndex, index);
    }
};

function toggleSubtaskCheckbox(columnIndex, taskIndex, subtaskIndex){
    const task = taskList[columnIndex].tasks[taskIndex]
    task.subtasks[subtaskIndex].finished = !task.subtasks[subtaskIndex].finished;
}

