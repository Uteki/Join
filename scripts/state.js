import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const logOut = document.getElementById("log-out");
const userIn = JSON.parse(localStorage.getItem("user"));

const userName = document.getElementsByClassName("summary-user-name")[0];

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

logOut.addEventListener("click", function (event) {
    signOut(auth).then(() => {
        alert("Logged out");

        localStorage.removeItem("user");
        window.location.replace("../index.html");
    })
    .catch((error) => {
        console.error(error);
        alert(error.code + " " + error.message);
    })
})

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        //TODO: get data from uid?
        document.getElementsByClassName("summary-user-name")[0].innerHTML = user.displayName;
        // ...
    } else {
        localStorage.removeItem("user");
        window.location.replace("../index.html");
    }
});