console.log("AnimeVerse Loaded");
window.openMenu = function () {

    document.getElementById("sidebar").style.left = "0";

    document.getElementById("overlay").style.display = "block";

};

window.closeMenu = function () {

    document.getElementById("sidebar").style.left = "-300px";

    document.getElementById("overlay").style.display = "none";

};
import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

async function loadAnime() {

const snapshot = await getDocs(collection(db, "animes"));

const animes = [];
console.log(snapshot.size);

snapshot.forEach(doc => {
    animes.push({
        id: doc.id,
        ...doc.data()
    });
});

const container=document.getElementById("anime-container");

let current=0;

const hero = document.getElementById("hero");

if (hero) {

    function changeHero() {

        const anime = animes[current];

        hero.style.backgroundImage =
            `url(${anime.poster})`;

        document.getElementById("hero-title").innerHTML =
            anime.title;
document.getElementById("hero-description").innerHTML =
"Watch Anime in diffrent language and qualities";

        document.getElementById("watch-btn").href =
            `anime.html?id=${anime.id}`;

        document.getElementById("download-btn").href =
            `anime.html?id=${anime.id}`;

        document.getElementById("download-btn").target = "_blank";

        current++;

        if (current >= animes.length)
            current = 0;

    }

    changeHero();

    setInterval(changeHero, 5000);

}
const page = new URLSearchParams(window.location.search).get("type");

let filtered = animes;

// Home page
if(window.location.pathname.includes("index.html") || window.location.pathname.endsWith("/")){
    filtered = animes;
}

// Latest
if(page==="latest"){

document.getElementById("pageTitle").innerHTML="🆕 Latest Anime";

filtered=[...animes].reverse();

}

// Movies
else if(page==="movies"){

document.getElementById("pageTitle").innerHTML="🎬 Anime Movies";

filtered=animes.filter(a=>a.type==="Movie");

}

// Ongoing
else if(page==="ongoing"){

document.getElementById("pageTitle").innerHTML="📺 Ongoing Anime";

filtered=animes.filter(a=>a.status==="Ongoing");

}

// Completed
else if(page==="completed"){

document.getElementById("pageTitle").innerHTML="✅ Completed Anime";

filtered=animes.filter(a=>a.status==="Completed");

}

filtered.forEach(anime=>{

container.innerHTML += `

<a href="anime.html?id=${anime.id}" class="card">

<div class="badge">${anime.status}</div>

<img src="${anime.poster}">

<div class="card-info">

<h3>${anime.title}</h3>

<p>${anime.genre}</p>

<p>Episodes : ${anime.totalEpisodes ?? "Movie"}</p>

</div>

</a>

`;

});
const searchBox = document.getElementById("searchBox");
const results = document.getElementById("searchResults");

if (searchBox && results) {

    searchBox.addEventListener("input", () => {

        const value = searchBox.value.toLowerCase().trim();

        results.innerHTML = "";

        if (value === "") {

            results.style.display = "none";

            return;

        }

        const filtered = animes.filter(anime =>
            anime.title.toLowerCase().includes(value)
        );

        if (filtered.length === 0) {

            results.style.display = "none";

            return;

        }

        filtered.forEach(anime => {

            results.innerHTML += `

<a href="anime.html?id=${anime.id}" class="search-item">

<img src="${anime.poster}">

<div>

<h4>${anime.title}</h4>

<p>${anime.genre}</p>

</div>

</a>

`;

        });

        results.style.display = "block";

    });

    document.addEventListener("click", (e) => {

        if (!document.querySelector(".search-box").contains(e.target)) {

            results.style.display = "none";

        }

    });

}

document.addEventListener("click",(e)=>{

if(!document.querySelector(".search-box").contains(e.target)){

results.style.display="none";

}

});
}

loadAnime();