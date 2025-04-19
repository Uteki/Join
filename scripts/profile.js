import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, updateProfile, updateEmail } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const user = JSON.parse(localStorage.getItem("user"));

export async function profileUpdater(uID, editContact) {
    if (user && user.uid === uID) {
        try {
            const firebaseUser = auth.currentUser;
            if (firebaseUser && firebaseUser.uid === user.uid) {
                if (firebaseUser.displayName !== editContact.name.value) {
                    await updateProfile(firebaseUser, { displayName: editContact.name.value });
                    user.displayName = editContact.name.value;
                    localStorage.setItem("user", JSON.stringify(user))
                    document.getElementsByClassName("user-initials")[0].textContent = user.displayName.trim().split(" ").map(name => name[0]).join("").slice(0, 2);
                }
            }
        } catch (error) { console.error(error) }
    } else { console.log("Cannot change the data") }
}

window.profileUpdater = profileUpdater;