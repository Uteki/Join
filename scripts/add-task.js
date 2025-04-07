function getElementById(id) {
    return document.getElementById(id);
}

function clearInputFields() {
    const fields = ['title', 'dueDate', 'category', 'subtask', 'description'];
    fields.forEach(field => {
        const inputElement = getElementById(field);
        if (inputElement) inputElement.value = '';
    });
    const assignedToInput = document.querySelector('.task-overlay-editor-assigned-selection');
    if (assignedToInput) assignedToInput.value = '';
    document.querySelectorAll('.priority-button').forEach(btn => {
        btn.style.backgroundColor = '';
    });
}

function setupMessage(message, isSuccess) {
    const messageDiv = getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = 'message ' + (isSuccess ? 'success' : 'error');
    messageDiv.style.display = 'block'; 
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

function setupButtonListener(buttonId, callback) {
    const button = getElementById(buttonId);
    if (button) button.addEventListener('click', callback);
}

function setupClearButtonListener() {
    setupButtonListener('clearButton', () => {
        clearInputFields();
        clearFields(); 
    });
}

function setupCreateButtonListener() {
    setupButtonListener('createButton', createTask);
}

function createTask() {
    const title = getElementById('title').value.trim();
    const dueDate = getElementById('dueDate').value.trim();
    const category = getElementById('category').value;
    if (!title || !dueDate || !category) {
        setupMessage("Please fill out the required fields", false);
        return; }
    const success = true; 
    if (success) {
        setupMessage("Succesful", true);
        setTimeout(() => {
            clearInputFields();
        }, 100);  } else {
        setupMessage("Not Succesful", false);
    }
}

function setPriority(element, color) {
    document.querySelectorAll('.priority-button').forEach(btn => {
        btn.style.backgroundColor = '';   });
    element.style.backgroundColor = color;
}

function setupDropdownListener() {
    const dropdownButton = getElementById('dropdownButton');
    const dropdownContent = getElementById('dropdownContent');
    if (dropdownButton && dropdownContent) {
        dropdownButton.addEventListener('click', () => {
            dropdownContent.classList.toggle('open');
        });
    }
}

function setupEventListeners() {
    setupClearButtonListener();
    setupCreateButtonListener();
    setupDropdownListener();
}

document.addEventListener('DOMContentLoaded', setupEventListeners);














async function renderFormData() {
    await init()
    console.log(contactList);
}
