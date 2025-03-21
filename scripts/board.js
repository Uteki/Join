const boardContent = document.getElementById('boardContent')

async function renderTasks() {
    await init() ;
    await renderColumns();

}

async function renderColumns(){
    for (let index = 0; index < taskList.length; index++) {
        const element = taskList[index];
        boardContent.innerHTML += boardColumnTemplate(element, index);
        renderTaskContainer(element.tasks, index);
    }
}

function renderTaskContainer(tasks, columnIndex){
    const boardColumn = document.getElementById(`boardColumn${columnIndex}`)
    for (let index = 0; index < tasks.length; index++) {
        const element = tasks[index];
        boardColumn.innerHTML += boardTaskTemplate(element, index);
    }
}