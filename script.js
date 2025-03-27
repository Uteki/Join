const BASE_URL = firebaseConfig.databaseURL + "/join/";

let user = [];
let contactList = [];
let taskList;

async function init() {
    await connect()
}

async function connect() {
    let response = await fetch(BASE_URL + ".json");
    let json = await response.json();

    user = json.user;
    contactList = json.contactList;
    // taskList = json.taskList;
    taskList = await JSON.parse(json.tasks);
}


async function updateTaskList() {
    let response = await fetch(BASE_URL + '.json', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            tasks: JSON.stringify(taskList),
          })
    });
    console.log(response)

}









// Löschen wir noch, sind die Farben in Add Task beim anklicken der Priority.


   function setPriority(selectedButton, color) {
        
        const buttons = document.querySelectorAll('.button-group .priority-button');
        
        
        buttons.forEach(button => {
            button.style.backgroundColor = ''; 
            button.style.color = ''; 
        });

       
        selectedButton.style.backgroundColor = color; 
        selectedButton.style.color = 'white'; 
    }

    
    document.getElementById('clearButton').addEventListener('click', function() {
        document.getElementById('taskForm').reset();
        const buttons = document.querySelectorAll('.button-group .priority-button');
        buttons.forEach(button => {
            button.style.backgroundColor = ''; 
            button.style.color = ''; 
        });
    });


    




 
     // Priority handling function
     function setPriority(element, color) {
        const buttons = document.querySelectorAll('.priority-button');
        buttons.forEach(btn => {
            btn.style.backgroundColor = ''; // Reset background color
        });
        element.style.backgroundColor = color; // Highlight selected button
    }

      // Dropdown-Logik für Assigned to
      const dropdownButton = document.getElementById('dropdownButton');
      const dropdownContent = document.getElementById('dropdownContent');
      const checkboxes = document.querySelectorAll('.team-member');
      const selectedMembersText = document.getElementById('selectedMembers');

      // Dropdown öffnen
      dropdownButton.addEventListener('click', () => {
          dropdownContent.classList.toggle('open');
      });

      // Schließen des Dropdowns, wenn man außerhalb klickt
      window.addEventListener('click', (event) => {
          if (!dropdownContent.contains(event.target) && dropdownContent.classList.contains('open')) {
              dropdownContent.classList.remove('open');
          }
      });

      // Funktion zum Aktualisieren des angezeigten Textes
      checkboxes.forEach(checkbox => {
          checkbox.addEventListener('change', () => {
              const selectedMembers = Array.from(checkboxes)
                  .filter(i => i.checked)
                  .map(i => i.parentNode.innerText.trim());
              
              selectedMembersText.textContent = selectedMembers.length > 0 ? selectedMembers.join(', ') : 'Select contacts to assign';
          });
      });
    // Fallback für den Clear Button
    document.getElementById('clearButton').addEventListener('click', function () {
        document.getElementById('taskForm').reset();
        selectedMembersText.textContent = 'Select team members'; // Reset zur Standardanzeige
        checkboxes.forEach(checkbox => checkbox.checked = false); // Alle Checkboxen zurücksetzen
    });