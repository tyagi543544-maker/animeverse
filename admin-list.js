import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

});
let allAnime = [];
async function loadAnime() {

    const container = document.getElementById("animeList");

    container.innerHTML = "";

    const snapshot = await getDocs(collection(db, "animes"));
allAnime = [];

snapshot.forEach(doc => {

    allAnime.push({

        id: doc.id,

        ...doc.data()

    });

});
   allAnime.forEach(anime => {

    const card = document.createElement("div");

card.className = "animeCard";

card.innerHTML = `
    <img src="${anime.poster}" width="120">

    <div>

        <h2>${anime.title}</h2>

        <p>Type : ${anime.type}</p>

        <p>Status : ${anime.status}</p>

      <button
class="editBtn"
onclick="editAnime('${anime.id}')">

✏ Edit

</button>

        <button class="deleteBtn" data-id="${anime.id}">
            🗑 Delete
        </button>

    </div>
`;

container.appendChild(card);

});

}

loadAnime();
// ==========================
// DELETE ANIME
// ==========================

document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("deleteBtn")) return;

    const id = e.target.dataset.id;

    const confirmDelete = confirm(
        "Are you sure you want to delete this anime?"
    );

    if (!confirmDelete) return;

    try {

        await deleteDoc(doc(db, "animes", id));

        alert("Anime Deleted Successfully!");

        loadAnime();

    } catch (err) {

        console.error(err);

        alert("Failed to delete anime.");

    }

});
document.getElementById("searchBox").addEventListener("input", e => {

    const value = e.target.value.toLowerCase();

    document.querySelectorAll(".animeCard").forEach(card => {

        const title = card.querySelector("h2").innerText.toLowerCase();

        if (title.includes(value)) {

            card.style.display = "flex";

        } else {

            card.style.display = "none";

        }

    });

});
window.editAnime = function(id){

    window.location.href = `admin.html?edit=${id}`;

}

window.editAnime = function(id){

    window.location.href = `admin.html?edit=${id}`;

}
document.getElementById("logoutBtn").onclick = async () => {

    await signOut(auth);

    window.location.href = "login.html";

};
