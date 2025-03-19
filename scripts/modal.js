const modal = document.getElementById("myModal");

function closeModal(e) {
    if (e.target === modal) {
        quitModal()
    }
}

function quitModal() {
    modal.classList.add('tl-out');

    setTimeout(() => {
        modal.close();
        modal.classList.remove("tl-out");
        document.querySelectorAll("#edit-modal, #add-modal").forEach((id) => id.classList.add('d-none'));
    }, 500);
}

function openModal(dialog) {
    document.getElementById(`${dialog}-modal`).classList.toggle("d-none");
    modal.showModal()
}

