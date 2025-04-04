// Funktion zum Setzen der Priorität und Aktualisieren der Button-Stile
function setPriority(selectedButton, color) {
    const buttons = document.querySelectorAll('.priority-button');
    buttons.forEach(button => {
        button.style.backgroundColor = '';
        button.style.color = 'black';
        button.classList.remove('active');
    });
    selectedButton.style.backgroundColor = color;
    selectedButton.style.color = 'white';
    selectedButton.classList.add('active');
}

function clearFields() {
    // Felder zurücksetzen
    document.getElementById('title').value = '';
    document.getElementById('dueDate').value = '';
    document.getElementById('category').value = '';
    document.getElementById('subtask').value = ''; // Subtask-Feld zurücksetzen
    document.getElementById('description').value = ''; // Description-Feld zurücksetzen
    document.getElementById('assignedToInput').value = ''; // Assigned To-Feld zurücksetzen

    // Reset für zugewiesene Kontakte
    const checkboxes = document.querySelectorAll('.team-member');
    checkboxes.forEach(checkbox => checkbox.checked = false); // Alle Checkboxen zurücksetzen
    document.getElementById('selectedMembers').textContent = 'Select team members'; // Standardanzeige zurücksetzen

    // Reset für Prioritätsbuttons
    const buttons = document.querySelectorAll('.priority-button');
    buttons.forEach(button => {
        button.style.backgroundColor = '';
        button.style.color = 'black';
        button.classList.remove('active');
    });

    // Fehlermeldungen zurücksetzen
    document.getElementById('errorMessageContainer').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
}

// Event Listener für den Clear-Button
document.getElementById('clearButton').addEventListener('click', clearFields);

// Dropdown Logik
document.addEventListener('DOMContentLoaded', () => {
    const dropdownButton = document.querySelector('.dropdown-button');
    const dropdownContent = document.querySelector('.dropdown-content');
    const checkboxes = document.querySelectorAll('.team-member');
    const selectedMembersText = document.getElementById('selectedMembers');

    dropdownButton.addEventListener('click', () => {
        dropdownContent.classList.toggle('open');
    });

    window.addEventListener('click', (event) => {
        if (!dropdownContent.contains(event.target) && dropdownContent.classList.contains('open')) {
            dropdownContent.classList.remove('open');
        }
    });

    // Checkbox-Änderung und Aktualisierung des angezeigten Textes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const selectedMembers = Array.from(checkboxes)
                .filter(i => i.checked)
                .map(i => i.parentNode.innerText.trim());

            selectedMembersText.textContent = selectedMembers.length > 0 ? selectedMembers.join(', ') : 'Select contacts to assign';
        });
    });
});

// Funktion zum Erstellen der Aufgabe
function createTask() {
    const title = document.getElementById('title').value;
    const dueDate = document.getElementById('dueDate').value;
    const category = document.getElementById('category').value;

    const errorMessageContainer = document.getElementById('errorMessageContainer');
    const successMessage = document.getElementById('successMessage');

    errorMessageContainer.style.display = 'none';
    successMessage.style.display = 'none';

    if (!title || !dueDate || !category) {
        errorMessageContainer.style.display = 'block'; 
        return;
    }

    // Hier kannst du den Code hinzufügen, um die Aufgabe zu speichern (z.B. in einer Datenbank oder einer API)
    console.log('Task created:', { title, dueDate, category }); // Zum Testen in der Konsole anzeigen

    successMessage.style.display = 'block'; // Erfolgsnachricht anzeigen
    clearFields(); // Felder zurücksetzen
}

// Event Listener für den Create Task Button
document.getElementById('createButton').addEventListener('click', createTask);













 
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
