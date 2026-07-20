import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);

const animeId = params.get("id");

const packNumber = Number(params.get("pack"));

async function loadDownload() {

    const snap = await getDoc(doc(db, "animes", animeId));

    if (!snap.exists()) {

        document.body.innerHTML = "<h1>Anime Not Found</h1>";

        return;

    }

    const anime = snap.data();

    document.getElementById("title").textContent = anime.title;

    document.getElementById("poster").src = anime.poster;

    const downloadArea = document.getElementById("downloadArea");

    downloadArea.innerHTML = "";
const languageName = params.get("lang");

const language = anime.languages.find(
    l => l.name === languageName
);

if (!language) {

    downloadArea.innerHTML = "<h2>Language Not Found</h2>";

    return;

}

const pack = language.packs.find(
    p => p.pack === packNumber
);

if (!pack) {

    downloadArea.innerHTML = "<h2>Pack Not Found</h2>";

    return;

}

// ZIP

if (pack.zip["720p"].shortUrl) {

    downloadArea.innerHTML += `

<a class="btn"
href="${pack.zip["720p"].shortUrl}"
target="_blank">

📦 720P ZIP

</a>

`;

}

if (pack.zip["1080p"].shortUrl) {

    downloadArea.innerHTML += `

<a class="btn"
href="${pack.zip["1080p"].shortUrl}"
target="_blank">

📦 1080P ZIP

</a>

`;

}

// Episodes

pack.episodes.forEach(ep => {

    downloadArea.innerHTML += `

<a class="btn"
href="${ep.shortUrl}"
target="_blank">

Episode ${ep.number}

</a>

`;

});
}

loadDownload();