import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);

const animeId = params.get("id");

async function loadAnime() {

    const snap = await getDoc(doc(db, "animes", animeId));

    if (!snap.exists()) {

        document.body.innerHTML =
            "<h1 style='text-align:center;margin-top:100px;'>Anime Not Found</h1>";

        return;

    }

    const anime = snap.data();

    document.getElementById("poster").src = anime.poster;

    document.getElementById("title").textContent = anime.title;

    document.getElementById("description").textContent = anime.description;

    document.getElementById("status").textContent = anime.status;

    document.getElementById("genre").textContent = anime.genre;

    document.getElementById("statusTag").textContent = anime.status;

    document.getElementById("episodes").textContent =
        anime.type === "Movie"
            ? "Movie"
            : anime.totalEpisodes;

    const container =
        document.getElementById("downloadButtons");

    container.innerHTML = "";

    if (anime.type === "Movie") {

        anime.qualities.forEach(q => {

            container.innerHTML += `

<a
class="btn"
href="${q.shortUrl}"
target="_blank">

🎬 ${q.quality}

</a>

`;

        });

    } 
   else {

    anime.languages.forEach(language => {

        container.innerHTML += `

        <div class="languageBlock">

            <div
                class="languageTitle"
                onclick="toggleLanguage(this)">

                🌐 ${language.name} ▼

            </div>

            <div class="packContainer">

                ${language.packs.map(pack => `

                    <a
                        class="btn"
                        href="download.html?id=${animeId}&lang=${encodeURIComponent(language.name)}&pack=${pack.pack}">

                        📦 Pack ${pack.pack}
                        <br>
                        Episodes ${pack.startEpisode}-${pack.endEpisode}

                    </a>

                `).join("")}

            </div>

        </div>

        `;

    });

}

}

loadAnime();
window.toggleLanguage = function (element) {

    // Hide all other pack lists
    document.querySelectorAll(".packContainer").forEach(container => {

        if (container !== element.nextElementSibling) {

            container.style.display = "none";

            container.previousElementSibling.innerHTML =
                container.previousElementSibling.innerHTML.replace("▲", "▼");

        }

    });

    const packContainer = element.nextElementSibling;

    if (packContainer.style.display === "block") {

        packContainer.style.display = "none";

        element.innerHTML = element.innerHTML.replace("▲", "▼");

    } else {

        packContainer.style.display = "block";

        element.innerHTML = element.innerHTML.replace("▼", "▲");

    }

};