const modal = document.getElementById("myModal");
let iniColor = document.getElementById("iniModal");

/**
 * Closes the modal
 *
 * @param e - Event
 */
function closeModal(e) {
    if (e.target === modal) {
        quitModal();
    }
}

/**
 * Quit the modal with more options
 *
 * @param cancel - Keyword given for clearing the values
 */
function quitModal(cancel) {
    modal.classList.add('tl-out');

    if (cancel) clearModal();

    setTimeout(() => {
        modal.close();
        modal.classList.remove("tl-out");
        document.querySelectorAll("#edit-modal, #add-modal").forEach((id) => id.classList.add('d-none'));
    }, 500)
}

/**
 * Clears the modal
 */
function clearModal() {
    addContact.name.value = "";
    addContact.email.value = "";
    addContact.phone.value = "";
}

/**
 * Opens the modal with the contact information
 *
 * @param {string} dialog - Refers to what dialog form it is
 * @param {number} id - Contact ID
 * @param {string} name - Contact name
 * @param {string} mail - Contact mail
 * @param {string} phone - Contact number
 * @param {string} color - Contact color
 */
function openModal(dialog, id, name, mail, phone, color) {
    if (dialog === "edit") {
        editContact.name.value = name; editContact.email.value = mail; editContact.phone.value = phone;

        getIni(name).then((response) => {
            iniColor.innerHTML = response; iniColor.style.backgroundColor = "#" + color;
        })

        document.getElementById("saveOrDelete").innerHTML = editButtonTemplate(id)
    }

    document.getElementById(`${dialog}-modal`).classList.toggle("d-none");
    modal.showModal()
}

/**
 * Opens the mobile small menu on the contact page
 */
function mobileCrudMenu() {
    if (document.querySelector("article") === null) return;

    const menu = document.getElementsByClassName("dd-menu").item(0);
    menu.classList.toggle("d-none");

    requestAnimationFrame(() => {
        document.onclick = function (event) {
            if (!menu.contains(event.target)) {
                menu.classList.add("d-none");
                document.onclick = null;
            }
        }
    })
}
