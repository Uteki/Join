function contactTemplate (abbr, name, mail, number) {
    return `<article>
        <div>${abbr}</div>
        
        <div>
            <h1>${name}</h1>
            
            <div>
                <button><i></i> Edit</button>
                <button><i></i> Delete</button>
            </div>
        </div>
        
        <p>Contact Information</p>
        <p>Email</p>
        <p>${mail}</p>
        <p>Phone</p>
        <p>+${number}</p>
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
    return `<button>
        <div>${abbr}</div>
        
        <div>
            <span>${name}</span>
            <span>${mail}</span>
        </div>
    </button>
    `
}