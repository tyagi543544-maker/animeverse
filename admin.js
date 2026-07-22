import { db } from "./firebase.js";

import {
    addDoc,
    updateDoc,
    getDoc,
    doc,
    collection
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

});
const editId = new URLSearchParams(window.location.search).get("edit");

const type = document.getElementById("type");
const seriesOptions = document.getElementById("seriesOptions");
const movieOptions = document.getElementById("movieOptions");


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

// ==========================
// LANGUAGE SYSTEM
// ==========================
let languages = [];

document.getElementById("addLanguage").onclick = () => {

    const name =
        document.getElementById("languageName").value.trim();

    if (!name) return;

    if (languages.some(l => l.name === name)) {

        alert("Language already exists");
        return;

    }

    languages.push({
        name
    });

    renderLanguages();

    document.getElementById("languageName").value = "";

};

function renderLanguages() {

    const container =
        document.getElementById("languageContainer");

    const select =
        document.getElementById("generateLanguage");

    container.innerHTML = "";
    select.innerHTML = "";

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

        select.innerHTML += `

<option value="${language.name}">

${language.name}

</option>

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

// ==========================
// GENERATE PACKS
// ==========================

function generatePacks() {

    const startEpisode =
        Number(document.getElementById("startEpisode").value);

    const endEpisode =
        Number(document.getElementById("endEpisode").value);

    const packSize =
        Number(document.getElementById("packSize").value);

    const packs =
        document.getElementById("packs");

    if (!startEpisode || !endEpisode || !packSize) {

        alert("Enter Start Episode, End Episode and Pack Size");
        return;

    }

    if (languages.length === 0) {

        alert("Add at least one language first");
        return;

    }

    const selectedLanguage =
        document.getElementById("generateLanguage").value;

    const language =
        languages.find(
            l => l.name === selectedLanguage
        );

    if (!language) return;

    // Remove only this language block
    const old =
        packs.querySelector(
            `[data-language-block="${language.name}"]`
        );

    if (old) {
        old.remove();
    }

    // Create language block
    const languageBlock =
        document.createElement("div");

    languageBlock.setAttribute(
        "data-language-block",
        language.name
    );

   languageBlock.innerHTML = `

<h2 class="languageTitle">

🌐 ${language.name}

</h2>

<div class="packControls">

<button
type="button"
class="addPackBtn"
data-language="${language.name}">

➕ Add Pack

</button>

</div>

`;

    packs.appendChild(languageBlock);

    let packNumber = 1;

    for (
        let start = startEpisode;
        start <= endEpisode;
        start += packSize
    ) {

        const end = Math.min(
            start + packSize - 1,
            endEpisode
        );

        let html = `

<div
class="pack"
data-language="${language.name}">

<h3>

📦 Pack ${packNumber}

(Episodes ${start}-${end})

<button
type="button"
class="deletePackBtn">

🗑 Delete Pack

</button>

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
placeholder="${language.name} 720P ZIP Link">

<input
class="zip1080"
placeholder="${language.name} 1080P ZIP Link">

<textarea
class="packNotice"
placeholder="📢 Notice / Warning (Optional)"
rows="3"></textarea>

</div>

`;

        languageBlock.innerHTML += html;

        packNumber++;

    }
document
.querySelectorAll(".addPackBtn")
.forEach(btn => {

    btn.onclick = () => {

      const language = btn.dataset.language;

const start = Number(
    prompt("Start Episode")
);

if (!start) return;

const end = Number(
    prompt("End Episode")
);

if (!end) return;

createPack(
    language,
    start,
    end
);

    };

});
document
.querySelectorAll(".deletePackBtn")
.forEach(btn => {

    btn.onclick = () => {

        if (!confirm("Delete this pack?"))
            return;

        btn.closest(".pack").remove();

    };

});
}

document
.getElementById("generate")
.addEventListener(
    "click",
    generatePacks
);
function createPack(
    language,
    start,
    end
){

    const languageBlock =
        document.querySelector(
            `[data-language-block="${language}"]`
        );

    if(!languageBlock) return;

    const form = document.createElement("div");

    form.className = "newPackForm";

    form.innerHTML = `

<hr>

<h3>➕ New Pack (${language})</h3>

<label>Start Episode</label>

<input
type="number"
class="newPackStart"
value="${start}">

<label>End Episode</label>

<input
type="number"
class="newPackEnd"
value="${end}">

<br><br>

<button
type="button"
class="createPackBtn">

Create Pack

</button>

<button
type="button"
class="cancelPackBtn">

Cancel

</button>

`;

    languageBlock.appendChild(form);
form.querySelector(".cancelPackBtn").onclick = () => {

    form.remove();
const newPack =
    languageBlock.lastElementChild;

newPack
.querySelector(".deletePackBtn")
.onclick = () => {

    if (!confirm("Delete this pack?"))
        return;

    newPack.remove();

};
};

form.querySelector(".createPackBtn").onclick = () => {

    const start = Number(
        form.querySelector(".newPackStart").value
    );

    const end = Number(
        form.querySelector(".newPackEnd").value
    );

    if (!start || !end || end < start) {

        alert("Invalid episode range");
        return;

    }

   let packNumber =
    languageBlock.querySelectorAll(".pack").length + 1;

let html = `

<div
class="pack"
data-language="${language}">

<h3>

📦 Pack ${packNumber}

(Episodes ${start}-${end})

<button
type="button"
class="deletePackBtn">

🗑 Delete Pack

</button>

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
data-language="${language}"
data-episode="${ep}"
placeholder="${language} Episode ${ep} Link">

</div>

`;

}
html += `

<hr>

<h4>ZIP Downloads</h4>

<input
class="zip720"
placeholder="${language} 720P ZIP Link">

<input
class="zip1080"
placeholder="${language} 1080P ZIP Link">

<textarea
class="packNotice"
placeholder="📢 Notice / Warning (Optional)"
rows="3"></textarea>

</div>

`;
form.insertAdjacentHTML(
    "beforebegin",
    html
);

form.remove();
};
}
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

        anime.languages.forEach(language => {

    document.getElementById("generateLanguage").value =
        language.name;

    document.getElementById("packSize").value =
        anime.packSize;

    const firstPack = language.packs[0];
    const lastPack =
        language.packs[language.packs.length - 1];

    document.getElementById("startEpisode").value =
        firstPack.startEpisode;

    document.getElementById("endEpisode").value =
        lastPack.endEpisode;

    generatePacks();

            language.packs.forEach(pack => {

                const languageBlock =
    document.querySelector(
        `[data-language-block="${language.name}"]`
    );

const packDiv =
    languageBlock.querySelectorAll(".pack")[pack.pack - 1];

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
packDiv.querySelector(".packNotice").value =
    pack.notice || "";
            });

        });

    }

}

loadForEdit();
// ==========================
// PUBLISH
// ==========================

document.getElementById("publish").addEventListener("click", async () => {
const btn = document.getElementById("publish");
btn.disabled = true;
btn.innerHTML = "Updating...";
btn.innerHTML = '<span class="loader"></span>Updating...';
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
const notice =
    packDiv.querySelector(".packNotice").value.trim();
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

    notice,

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

} finally {

    btn.disabled = false;

    btn.innerHTML = editId
        ? "✅ Update Anime"
        : "✅ Publish Anime";

}

});
document.getElementById("logoutBtn").onclick = async () => {

    await signOut(auth);

    window.location.href = "login.html";

};
