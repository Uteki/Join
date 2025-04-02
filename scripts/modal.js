const modal = document.getElementById("myModal");

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

function openModal(dialog) {
    document.getElementById(`${dialog}-modal`).classList.toggle("d-none");
    modal.showModal()
}

function mobileCrudMenu() {
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
