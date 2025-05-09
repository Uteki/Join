import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const submitSignIn = document.getElementById("sign-sub");
const submitLogin = document.getElementById("sub-login");
const guestLogin = document.getElementById("g-login");

/**
 * Registering option to make an account
 */
submitSignIn.addEventListener("click", async function (event) {
    event.preventDefault();
    const email = document.getElementById("mail-sign").value;
    const password = document.getElementById("pw-sign").value;
    const name = document.getElementById("name").value;
    try {
        if (wrongRegData()) return;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user; await createContactSign(name, email, user.uid);
        await updateProfile(user, { displayName: name }); await setStorage(user); await setUserData(user.uid, name, email);
        loginAfter();
    } catch (error) {
        console.log(error); document.querySelector(".signUpError").classList.add("upMail");
    }
});

/**
 * Log in functionality, checks the backend if it worked
 */
submitLogin.addEventListener("click", function (event) {
    event.preventDefault();
    const email = document.getElementById("mail-login").value;
    const password = document.getElementById("pw-login").value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            setStorage(user);

            window.location.href = "../pages/summary.html";
        })
        .catch((error) => {
            wrongData(error);
        });
})

/**
 * Anonymous data for guest to be able to try out
 */
guestLogin.addEventListener("click", function (event) {
    event.preventDefault(); guestLogin.disabled = true
    signInAnonymously(auth)
        .then((per) => {
            let anon = per.user;
            updateProfile(anon, { displayName: 'Guest' })
                .then(() => {
                    setStorage(anon); window.location.href = "../pages/summary.html";
                })
        })
        .catch((error) => { console.error(error);
            alert(error.code + " " + error.message)
            guestLogin.disabled = false;
        })
})

/**
 * Creates your contact
 *
 * @param {string} name - Sign up name
 * @param {string} email - Sign up mail
 * @param {string} uid - Sign up UID
 * @param {string} [path="contactList/"] - Where it should be saved
 * @param {object} [data={}] - Empty if nothing
 * @returns {Promise<void>} - Is ignored
 * @async
 */
async function createContactSign (name, email, uid, path="contactList/", data={}) {
    let contacts = await theContacts(); let newKey = contacts?.length || 0;
    let newId = generateId(contactList); document.getElementById("sign-sub").disabled = true;

    let response = await fetch(BASE_URL + path + `${newKey}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name: upperSense(name), email: email, phone: 0, id: newId, color: generateColor(), uid: uid})
    });
    await response.json();
}

/**
 * Sorted contactList
 *
 * @returns {Promise<object[]>} - Sorted contact array
 * @async
 */
async function theContacts() {
    let response = await fetch(BASE_URL + ".json");
    let json = await response.json();

    return contactList = json.contactList.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Waits for message that it worked and redirects to base form login
 */
function loginAfter() {
    document.getElementById("sign-success").classList.toggle("d-none");

    setTimeout(() => {
        signUp();
        document.getElementById("sign-success").classList.toggle("d-none");
    }, 2500);
}

/**
 * Pushes the registered data into db
 *
 * @param {string} userId - UID of your data
 * @param {string} name - Name of your data
 * @param {string} email - Mail of your data
 * @returns {Promise<void>} - Finishes with pushed data
 */
function setUserData(userId, name, email) {
    const db = getDatabase(app);
    const userRef = ref(db, 'join/users/' + userId);

    return set(userRef, {
        uid: userId, username: name, email: email
    })

    .then(() => {console.log("Data saved on DB")})
    .catch((error) => {
        console.error(error);
        alert(error.code + " " + error.message);
    });
}

/**
 * Set local storage to your data log in
 *
 * @param {object} user - User data
 */
function setStorage(user) {
    localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email
    }));
}

/**
 * Mark the form inputs where the validation fails
 */
function wrongData() {
    let errorMsg = document.getElementById("err-msg");

    document.querySelectorAll("#start-page main form input").forEach((input) => {
        input.style.border = "1px solid red";
        errorMsg.classList.add("loginError");

        setTimeout(() => {
            input.style.border = "1px solid var(--placeholder-grey)";
            errorMsg.classList.remove("loginError");
        }, 5000);
    })
}

/**
 * Checks validation for register field
 *
 * @returns {boolean} - True if error exists
 */
function wrongRegData() {
    const box = document.getElementById("agreement");
    const err = document.querySelector(".signUpError");
    const area = {
        name: document.getElementById("name"), email: document.getElementById("mail-sign"),
        pw1: document.getElementById("pw-sign"), pw2: document.getElementById("pw-signUp")
    }; let error = false;

    if (box.checked !== true) error = showError(err, "upCheckbox");
    if (area.pw1.value !== area.pw2.value) error = showError(err, "upPassword", "pw-sign", "pw-signUp");
    if (area.pw1.value.length < 6) error = showError(err, "upPass", "pw-sign");
    if (!area.email.value.includes("@") || !area.email.value.includes(".")) error = showError(err, "upEmail", "mail-sign");
    if (area.name.value.length < 1) error = showError(err, "upName", "name"); return error;
}

/**
 * Times out the error and remove it after
 *
 * @param {string} id - Error id
 */
function timeout(id) {
    let ids = document.getElementById(`${id}`);

    ids.style.border = "1px solid red";

    setTimeout(() => {
        ids.style.border = "1px solid var(--placeholder-grey)";
    }, 5000);
}

/**
 * Removes the error
 *
 * @param {HTMLElement} err - Error area
 * @param {string} id - Error message
 */
function removeError(err, id) {
    setTimeout(() => {
        err.classList.remove(id);
    }, 5000);
}

/**
 * Shows error whenever validation fails
 *
 * @param {HTMLElement} err - Error area
 * @param {string} content - Specific error message
 * @param {string} [input] - Error input field
 * @param {string} [extra] - Variable to check if there is another field
 * @returns {boolean} - True if error triggered
 */
function showError(err, content, input, extra) {
    err.classList.add(content);

    [input, extra].forEach((el) => {
        if (el) timeout(el);
    })

    removeError(err, content);
    return true;
}