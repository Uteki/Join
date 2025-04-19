const modal = document.getElementById("myModal");
let iniColor = document.getElementById("iniModal");

function closeModal(e) {
    if (e.target === modal) {
        quitModal();
    }
}

function quitModal(cancel) {
    modal.classList.add('tl-out');

    if (cancel) clearModal();

    setTimeout(() => {
        modal.close();
        modal.classList.remove("tl-out");
        document.querySelectorAll("#edit-modal, #add-modal").forEach((id) => id.classList.add('d-none'));
    }, 500)
}

function clearModal() {
    addContact.name.value = "";
    addContact.email.value = "";
    addContact.phone.value = "";
}

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
