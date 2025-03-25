import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const submitSignIn = document.getElementById("sign-sub");
const submitLogin = document.getElementById("sub-login");

submitSignIn.addEventListener("click", async function (event) {
    event.preventDefault();

    const email = document.getElementById("mail-sign").value;
    const password = document.getElementById("pw-sign").value;
    const name = document.getElementById("name").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        setStorage(user);

        await updateProfile(user, { displayName: name });
        await setUserData(user.uid, name, email);

        alert("Creating");
        window.location.href = "../pages/summary.html";
    } catch (error) {
        console.error(error);
        alert(error.code + " " + error.message);
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

            alert("login");
            window.location.href = "../pages/summary.html";
        })
        .catch((error) => {
            console.error(error);
            alert(error.code + " " + error.message);
        });
})

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