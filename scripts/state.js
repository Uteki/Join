import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const logOut = document.getElementById("log-out");
const userIn = JSON.parse(localStorage.getItem("user"));

const userName = document.getElementsByClassName("summary-user-name")[0];

/**
 * Displays user initials and name if available in local storage
 */
if (userIn) {
    let name = userIn.displayName.trim();
    let abbr = name.indexOf(" ");
    let initials = name.slice(0, 1);

    if (abbr !== -1) {
        initials += name.slice(abbr + 1, abbr + 2);
    }

    document.getElementsByClassName("user-initials")[0].textContent = initials;

    if (userName) userName.textContent = name;
}

/**
 * Handles user logout
 * Signs the user out using Firebase Auth, clears local storage, and redirects to login page
 */
logOut.addEventListener("click", function (event) {
    signOut(auth).then(() => {
        localStorage.removeItem("user");
        window.location.replace("../index.html");
    })
    .catch((error) => {
        console.error(error);
        alert(error.code + " " + error.message);
    })
})

/**
 * Auth state observer
 * Monitors authentication state and updates the UI or redirects if the user is not logged in
 */
onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        let display = document.getElementsByClassName("summary-user-name")[0];
        if (display) display.innerHTML = user.displayName;
    } else {
        localStorage.removeItem("user");
        window.location.replace("../index.html");
    }
});