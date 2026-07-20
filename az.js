import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const letters = document.getElementById("letters");
const container = document.getElementById("anime-container");

const alphabet = ["#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

alphabet.forEach(letter => {

    letters.innerHTML += `
    <button class="letterBtn" data-letter="${letter}">
        ${letter}
    </button>
    `;

});

let animes = [];

async function load() {

    const snapshot = await getDocs(collection(db, "animes"));

    snapshot.forEach(doc => {

        animes.push({
            id: doc.id,
            ...doc.data()
        });

    });

}

load().then(() => {

    function showAnime(letter) {

    container.innerHTML = "";

    let filtered;

    if (letter === "#") {

        filtered = animes.filter(a =>
            /^[0-9]/.test(a.title)
        );

    } else {

        filtered = animes.filter(a =>
            a.title.toUpperCase().startsWith(letter)
        );

    }

    if (filtered.length === 0) {

        container.innerHTML = "<h2>No Anime Found</h2>";

        return;

    }

    filtered.forEach(anime => {

        container.innerHTML += `

<a href="anime.html?id=${anime.id}" class="card">

<img src="${anime.poster}">

<div class="card-info">

<h3>${anime.title}</h3>

<p>${anime.genre}</p>

<p>Episodes : ${anime.totalEpisodes ?? "Movie"}</p>

</div>

</a>

`;

    });

}

document.querySelectorAll(".letterBtn").forEach(btn => {

    btn.onclick = () => {

        showAnime(btn.dataset.letter);

    };

});

const hasNumbers = animes.some(a => /^[0-9]/.test(a.title));

if (hasNumbers) {

    showAnime("#");

} else {

    showAnime("A");

}

});