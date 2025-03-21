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

function boardColumnTemplate (column, index){
    return `
        <div class="board-column" id="boardColumn${index}">
            <div class="board-column-header">
                <h2>${column.name}</h2>
                <button type="button">+</button>
            </div>
            <div class="board-column-tasks">
            </div>   
        </div>   
        `
}

function boardTaskTemplate (task){
    return `
        <div class="board-task-container" draggable="true">
            <span class="board-task-category">${task.category}</span>
            <div class="board-task-description">
                <h3 class="board-task-container-title">${task.title}</h3>
                <p>${task.description}</p>
            </div>
            <div class="board-task-progress-container">
                <div class="board-task-progress-bar-container">
                    <div class="board-task-progress-bar"></div>
                </div>
                <span class="board-task-progress">1/2 Subtasks</span>
            </div>
            <div class="board-task-bottom-container">
                <div class="board-task-involved">
                    
                    <div class="board-task-initial">SM</div>
                    <div class="board-task-initial">SM</div>
                </div>
                <img src="../assets/svg/Property 1=${task.priority}.svg" alt="">
            </div>
        </div>
        `
}

function boardTaskInitalsTemplate(){
    return `
        <div class="board-task-initial"></div>
    `
}