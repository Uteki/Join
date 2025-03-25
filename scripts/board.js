const boardContent = document.getElementById('boardContent')

let currentDraggedElement;

// Render functions

async function renderTasks() {
    await init();
    await renderColumns();

}

async function renderColumns() {
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
            boardColumnTasks.innerHTML += boardTaskTemplate(element, index);
        }
    } else {
        boardColumnTasks.innerHTML += boardTaskTemplateEmpty();
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

