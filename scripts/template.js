function contactTemplate (abbr, name, mail, number) {
    return `<article>
        <div>
            <div>${abbr}</div>
            
            <div class="m-left-40">
                <h2 class="m-none">${name}</h2>
    
                <div>
                    <button><i><img src="../assets/svg/contact-icons/edit.svg" alt="Edit"></i> Edit</button>
                    <button><i><img src="../assets/svg/contact-icons/delete.svg" alt="Delete"></i> Delete</button>
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