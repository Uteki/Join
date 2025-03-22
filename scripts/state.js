import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
//TODO: onAuthStateChanged checker if user is signed in

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const logOut = document.getElementById("log-out");

logOut.addEventListener("click", function (event) {
    signOut(auth).then(() => {
        alert("Logged out");
        console.log(window.location.origin);
        window.location.replace("../index.html");
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorCode + errorMessage);
    })
})

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        //TODO: get data from uid?
        console.log(user);
        // ...
    } else {
        // User is signed out
        // ...
    }
});