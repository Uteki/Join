import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const submitSignIn = document.getElementById("sign-sub");
const submitLogin = document.getElementById("sub-login");

submitSignIn.addEventListener("click", function (event) {
    event.preventDefault();

    const email = document.getElementById("mail-sign").value;
    const password = document.getElementById("pw-sign").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("creating")
            window.location.href = "../pages/summary.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorCode + errorMessage);
        });
})

submitLogin.addEventListener("click", function (event) {
    event.preventDefault();

    const email = document.getElementById("mail-login").value;
    const password = document.getElementById("pw-login").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("login");
            window.location.href = "../pages/summary.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorCode + errorMessage);
        });
})