import { db } from "./firebase.js";

import {
    addDoc,
    updateDoc,
    getDoc,
    doc,
    collection
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const editId = new URLSearchParams(window.location.search).get("edit");

const type = document.getElementById("type");
const seriesOptions = document.getElementById("seriesOptions");
const movieOptions = document.getElementById("movieOptions");

let languages = [];

// ==========================
// TYPE
// ==========================

function updateType() {

    if (type.value === "Series") {

        seriesOptions.style.display = "block";
        movieOptions.style.display = "none";

    } else {

        seriesOptions.style.display = "none";
        movieOptions.style.display = "block";

    }

}

type.addEventListener("change", updateType);
updateType();

// ==========================
// LANGUAGE SYSTEM
// ==========================

document.getElementById("addLanguage").onclick = () => {

    const name =
        document.getElementById("languageName").value.trim();

    if (!name) return;

    if (languages.some(l => l.name === name)) {

        alert("Language already exists");
        return;

    }

    languages.push({

        name,
        packs: []

    });
console.log("Before Render:", languages);
    renderLanguages();

    document.getElementById("languageName").value = "";

};

function renderLanguages() {

    const container =
        document.getElementById("languageContainer");

    container.innerHTML = "";

    languages.forEach(language => {

        container.innerHTML += `

<div class="languageItem">

<b>${language.name}</b>

<button
type="button"
class="removeLanguage"
data-name="${language.name}">

❌

</button>

</div>

`;

    });

    document
    .querySelectorAll(".removeLanguage")
    .forEach(btn => {

        btn.onclick = () => {

            languages =
                languages.filter(
                    l => l.name !== btn.dataset.name
                );

            renderLanguages();

        };

    });

}

// ==========================
// GENERATE PACKS
// ==========================

function generatePacks() {

    const totalEpisodes =
        Number(document.getElementById("episodes").value);

    const packSize =
        Number(document.getElementById("packSize").value);

    const packs =
        document.getElementById("packs");

    packs.innerHTML = "";

    if (!totalEpisodes || !packSize) {

        alert("Enter Total Episodes and Pack Size");
        return;

    }

    if (languages.length === 0) {

        alert("Add at least one language first");
        return;

    }

    languages.forEach(language => {

        packs.innerHTML += `

<h2 class="languageTitle">

🌐 ${language.name}

</h2>

`;

        let packNumber = 1;

        for (
            let start = 1;
            start <= totalEpisodes;
            start += packSize
        ) {

            const end =
                Math.min(
                    start + packSize - 1,
                    totalEpisodes
                );

            let html = `

<div
class="pack"
data-language="${language.name}">

<h3>

📦 Pack ${packNumber}

(Episodes ${start}-${end})

</h3>

`;

            for (
                let ep = start;
                ep <= end;
                ep++
            ) {

                html += `

<div class="episode">

<h4>Episode ${ep}</h4>

<input
class="episodeLink"
data-language="${language.name}"
data-episode="${ep}"
placeholder="${language.name} Episode ${ep} Link">

</div>

`;

            }

            html += `

<hr>

<h4>ZIP Downloads</h4>

<input
class="zip720"
data-language="${language.name}"
placeholder="${language.name} 720P ZIP Link">

<input
class="zip1080"
data-language="${language.name}"
placeholder="${language.name} 1080P ZIP Link">

</div>

`;

            packs.innerHTML += html;

            packNumber++;

        }

    });

}

document
.getElementById("generate")
.addEventListener(
    "click",
    generatePacks
);
// ==========================
// LOAD FOR EDIT
// ==========================

async function loadForEdit() {

    if (!editId) return;

    document.getElementById("publish").innerText =
        "Update Anime";

    const snap = await getDoc(
        doc(db, "animes", editId)
    );

    if (!snap.exists()) {

        alert("Anime not found");
        return;

    }

    const anime = snap.data();

    document.getElementById("title").value =
        anime.title;

    document.getElementById("poster").value =
        anime.poster;

    document.getElementById("genre").value =
        anime.genre;

    document.getElementById("description").value =
        anime.description;

    document.getElementById("type").value =
        anime.type;

    document.getElementById("status").value =
        anime.status;

    updateType();

    // ==========================
    // Load Languages
    // ==========================

    languages = [];

   if (anime.languages) {

    languages = [];

    anime.languages.forEach(lang => {

        languages.push({
            name: lang.name,
            packs: lang.packs
        });

    });

}

renderLanguages();

    // ==========================
    // Movies
    // ==========================

    if (anime.type === "Movie") {

        if (anime.qualities) {

            anime.qualities.forEach(q => {

                const input =
                    document.querySelector(
                        `.movieQuality[data-quality="${q.quality}"]`
                    );

                if (input) {

                    input.value = q.original;

                }

            });

        }

    }

    // ==========================
    // Series
    // ==========================

    if (anime.type === "Series") {

        document.getElementById("episodes").value =
            anime.totalEpisodes;

        document.getElementById("packSize").value =
            anime.packSize;

        generatePacks();

        anime.languages.forEach(language => {

            language.packs.forEach(pack => {

                const packDiv =
                    document.querySelector(
                        `.pack[data-language="${language.name}"]:nth-of-type(${pack.pack})`
                    );

                if (!packDiv) return;

                const episodeInputs =
                    packDiv.querySelectorAll(".episodeLink");

                pack.episodes.forEach((ep, i) => {

                    if (episodeInputs[i]) {

                        episodeInputs[i].value =
                            ep.original;

                    }

                });

                packDiv.querySelector(".zip720").value =
                    pack.zip["720p"].original;

                packDiv.querySelector(".zip1080").value =
                    pack.zip["1080p"].original;

            });

        });

    }

}

loadForEdit();
// ==========================
// PUBLISH
// ==========================

document.getElementById("publish").addEventListener("click", async () => {

    try {

        const title =
            document.getElementById("title").value.trim();

        const poster =
            document.getElementById("poster").value.trim();

        const genre =
            document.getElementById("genre").value.trim();

        const description =
            document.getElementById("description").value.trim();

        const type =
            document.getElementById("type").value;

        const status =
            document.getElementById("status").value;

        if (!title) {

            alert("Enter Anime Title");
            return;

        }

        if (!poster) {

            alert("Enter Poster URL");
            return;

        }

        const anime = {

            title,
            poster,
            genre,
            description,
            type,
            status,
            createdAt: Date.now()

        };

        // ==========================
        // MOVIE
        // ==========================

        if (type === "Movie") {

            const qualities = [];

            const qualityInputs =
                document.querySelectorAll(".movieQuality");

            for (const input of qualityInputs) {

                const link = input.value.trim();

                if (!link) continue;

                const response = await fetch(
                    "https://animeverse-api-r182.vercel.app/api/shorten",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            url: link
                        })
                    }
                );

                const result =
                    await response.json();

                qualities.push({

                    quality:
                        input.dataset.quality,

                    original:
                        link,

                    shortUrl:
                        result.shortenedUrl

                });

            }

            anime.qualities = qualities;

        }

        // ==========================
        // SERIES
        // ==========================
                if (type === "Series") {

            const languageData = [];

            for (const language of languages) {

                const packs = [];

                const packElements =
                    document.querySelectorAll(
                        `.pack[data-language="${language.name}"]`
                    );

                for (let p = 0; p < packElements.length; p++) {

                    const packDiv = packElements[p];

                    const episodeInputs =
                        packDiv.querySelectorAll(".episodeLink");

                    const zip720 =
                        packDiv.querySelector(".zip720").value.trim();

                    const zip1080 =
                        packDiv.querySelector(".zip1080").value.trim();

                    const episodes = [];

                    for (const input of episodeInputs) {

                        const link = input.value.trim();

                        if (!link) continue;

                        const response = await fetch(
                            "https://animeverse-api-r182.vercel.app/api/shorten",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    url: link
                                })
                            }
                        );

                        const result =
                            await response.json();

                        episodes.push({

                            number: Number(
                                input.dataset.episode
                            ),

                            original: link,

                            shortUrl: result.shortenedUrl

                        });

                    }

                    let zip720Short = "";

                    let zip1080Short = "";

                    if (zip720) {

                        const response = await fetch(
                            "https://animeverse-api-r182.vercel.app/api/shorten",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    url: zip720
                                })
                            }
                        );

                        zip720Short =
                            (await response.json()).shortenedUrl;

                    }

                    if (zip1080) {

                        const response = await fetch(
                            "https://animeverse-api-r182.vercel.app/api/shorten",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    url: zip1080
                                })
                            }
                        );

                        zip1080Short =
                            (await response.json()).shortenedUrl;

                    }

                    packs.push({

                        pack: p + 1,

                        startEpisode: Number(
                            episodeInputs[0].dataset.episode
                        ),

                        endEpisode: Number(
                            episodeInputs[
                                episodeInputs.length - 1
                            ].dataset.episode
                        ),

                        episodes,

                        zip: {

                            "720p": {

                                original: zip720,

                                shortUrl: zip720Short

                            },

                            "1080p": {

                                original: zip1080,

                                shortUrl: zip1080Short

                            }

                        }

                    });

                }

                languageData.push({

                    name: language.name,

                    packs

                });

            }

            anime.languages = languageData;

            anime.totalEpisodes =
                Number(
                    document.getElementById("episodes").value
                );

            anime.packSize =
                Number(
                    document.getElementById("packSize").value
                );

        }

        // ==========================
        // SAVE
        // ==========================

        if (editId) {

            await updateDoc(
                doc(db, "animes", editId),
                anime
            );

            alert("Anime Updated Successfully!");

        } else {

            await addDoc(
                collection(db, "animes"),
                anime
            );

            alert("Anime Added Successfully!");

        }

    } catch (err) {

        console.error(err);

        alert("Something went wrong!");

    }

});