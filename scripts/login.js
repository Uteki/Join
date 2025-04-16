import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const submitSignIn = document.getElementById("sign-sub");
const submitLogin = document.getElementById("sub-login");
const guestLogin = document.getElementById("g-login");

submitSignIn.addEventListener("click", async function (event) {
    event.preventDefault();

    const email = document.getElementById("mail-sign").value;
    const password = document.getElementById("pw-sign").value;
    const name = document.getElementById("name").value;

    try {
        if (wrongRegData()) return;

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user; await createContactSign(name, email, user.uid);

        await updateProfile(user, { displayName: name });
        await setStorage(user);
        await setUserData(user.uid, name, email);

        loginAfter();
    } catch (error) {
        console.log(error);
        document.querySelector(".signUpError").classList.add("upMail");
    }
});


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

guestLogin.addEventListener("click", function (event) {
    event.preventDefault(); guestLogin.disabled = true

    signInAnonymously(auth)
        .then((per) => {
            let anon = per.user;

            updateProfile(anon, { displayName: 'Guest' })
                .then(() => {
                    setStorage(anon);
                    window.location.href = "../pages/summary.html";
                })
        })
        .catch((error) => {
            console.error(error); alert(error.code + " " + error.message)
            guestLogin.disabled = false;
        })
})

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

async function theContacts() {
    let response = await fetch(BASE_URL + ".json");
    let json = await response.json();

    return contactList = json.contactList.sort((a, b) => a.name.localeCompare(b.name));
}

function loginAfter() {
    document.getElementById("sign-success").classList.toggle("d-none");

    setTimeout(() => {
        window.location.href = "../pages/summary.html";
    }, 2500);
}

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

function setStorage(user) {
    localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email
    }));
}

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

function wrongRegData() {
    const box = document.getElementById("agreement");
    const err = document.querySelector(".signUpError");
    const area = {
        name: document.getElementById("name"), email: document.getElementById("mail-sign"),
        pw1: document.getElementById("pw-sign"), pw2: document.getElementById("pw-signUp")
    }

    if (box.checked !== true) return showError(err, "upCheckbox");
    if (area.pw1.value !== area.pw2.value) return showError(err, "upPassword", "pw-sign", "pw-signUp");
    if (area.pw1.value.length < 6) return showError(err, "upPass", "pw-sign");
    if (!area.email.value.includes("@") || !area.email.value.includes(".")) return showError(err, "upEmail", "mail-sign");
    if (area.name.value.length < 1) return showError(err, "upName", "name");
}

function timeout(id) {
    let ids = document.getElementById(`${id}`);

    ids.style.border = "1px solid red";

    setTimeout(() => {
        ids.style.border = "1px solid var(--placeholder-grey)";
    }, 5000);
}

function removeError(err, id) {
    setTimeout(() => {
        err.classList.remove(id);
    }, 5000);
}

function showError(err, content, input, extra) {
    err.classList.add(content);

    [input, extra].forEach((el) => {
        if (el) timeout(el);
    })

    removeError(err, content);
    return true;
}