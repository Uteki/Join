import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
//TODO: anon sign in

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const submitSignIn = document.getElementById("sign-sub");
const submitLogin = document.getElementById("sub-login");

submitSignIn.addEventListener("click", function (event) {
    event.preventDefault();

    const email = document.getElementById("mail-sign").value;
    const password = document.getElementById("pw-sign").value;
    const name = document.getElementById("name").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            updateProfile(user, {
                displayName: name,
            }).then(() => {
                console.log("Profile updated successfully!");
            }).catch(error => console.error("Error updating profile:", error));

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
            console.log(user);
            alert("login");
            window.location.href = "../pages/summary.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorCode + errorMessage);
        });
})