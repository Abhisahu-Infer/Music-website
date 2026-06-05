console.log("this is the javascript programming");

let CurrentSong = new Audio();
let songs;

function secondsintominuteseconds(seconds) {
    if (isNaN(seconds || seconds < 0)) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingseconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedseconds = String(remainingseconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedseconds}`;
}


async function getsongs() {
    let response = await fetch("songs/");
    let html = await response.text();

    let div = document.createElement("div");
    div.innerHTML = html;

    let links = div.getElementsByTagName("a");

    let songs = [];

    for (let i = 0; i < links.length; i++) {
        let href = links[i].getAttribute("href");

        if (
            href.endsWith(".mp3") ||
            href.endsWith(".mp4") ||
            href.endsWith(".wav") ||
            href.endsWith(".m4a")
        ) {
            songs.push(href);
        }
    }
    console.log(songs);
    return songs;
}

const playsecondMusic = (track) => {
    CurrentSong.src = "songs/" + track + "mp3";
    CurrentSong.play();
    play.src = "assets/play-logo.svg";
    document.querySelector(".songdetails").innerHTML = decodeURIComponent(track.split("/").pop());
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
}

const playMusic = (track, pause = false) => {
    // CurrentSong.src = "songs/" + track + "mp3";
    CurrentSong.src = track;
    if (!pause) {
        CurrentSong.play();
        play.src = "assets/play-logo.svg";
    }
    document.querySelector(".songdetails").innerHTML = decodeURIComponent(track.split("/").pop());
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

async function main() {
    songs = await getsongs();
    playMusic(songs[0], true);

    const leftContent = document.getElementById("left-content");
    const homePageContent = leftContent.innerHTML;
    let button = document.getElementById("new-page-for-playlist");
    button.addEventListener("click", async function () {
        let leftContent = document.getElementById("left-content");
        history.pushState({ page: "playlist" }, "", "#playlist");
        leftContent.innerHTML = `
        <div class="playlist-page">     
            <h2 class="myplaylist">My Playlist</h2>
            <div class="addsongs">
                <ul>   
                </ul>
            </div>
            <button class="backBtn">Back</button>
        </div>`;

        window.addEventListener("popstate", function () {
            leftContent.innerHTML = homePageContent;
        });

        document.addEventListener("click", function (e) {
            if (e.target.classList.contains("backBtn")) {
                history.back();
            }
        });

        // now the element exists
        songs = await getsongs();

        let songlist = document
            .querySelector(".addsongs")
            .getElementsByTagName("ul")[0];
        console.log(songlist);

        for (const song of songs) {
            let songname = decodeURIComponent(song.split("/").pop()).replace(
                "mp3",
                "",
            );
            songlist.innerHTML += `<li>
                   <img class = "invert" src="assets/music.png" alt="" height="30px">
                   <div class="songinfo">
                      <div>${songname}</div>
                      <div>Random</div>
                   </div>
                   <div class=playnow>
                      <span>Play Now</span>
                      <img src="assets/playbtn.svg" alt="">
                   </div>  
               </li>`;
        }

        Array.from(
            document.querySelector(".addsongs").getElementsByTagName("li"),
        ).forEach((e) => {
            e.addEventListener("click", (element) => {
                console.log(e.querySelector(".songinfo").firstElementChild.innerHTML);
                playsecondMusic(
                    e.querySelector(".songinfo").firstElementChild.innerHTML.trim(),
                );
            });
        });
        //attach the event listener to the buttons
    });

    let getback = document.getElementById("backbtn");

    getback.addEventListener("click", () => {
        let
    })

}

main();

let play = document.querySelector(".play");
play.addEventListener("click", () => {
    if (CurrentSong.paused) {
        CurrentSong.play();
        play.src = "assets/play-logo.svg";
    } else {
        CurrentSong.pause();
        play.src = "assets/pausebutton.svg";
    }
});

CurrentSong.addEventListener("timeupdate", () => {
    console.log(CurrentSong.currentTime, CurrentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsintominuteseconds(CurrentSong.currentTime)}/${secondsintominuteseconds(CurrentSong.duration)}`
    document.querySelector(".circle").style.left = (CurrentSong.currentTime / CurrentSong.duration) * 100 + "%";
});

document.querySelector(".seekbar").addEventListener("click", e => {
    percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    CurrentSong.currentTime = ((CurrentSong.duration) * percent) / 100;
})

//adding the eventlistener to the menu icon 
document.querySelector(".menu-logo").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0%";
})

//Adding the eventlistener to the close button 
document.querySelector(".cancel-logo").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
})

//add eventlistener to the previous button
document.querySelector(".previous").addEventListener("click", () => {
    console.log("previous");
    let index = songs.indexOf(/songs/ + CurrentSong.src.split("/").slice(-1)[0]);
    if ((index - 1) >= 0) {
        console.log(index);
        playMusic(songs[index - 1]);
    }
})

document.querySelector(".next").addEventListener("click", () => {
    let index = songs.indexOf(/songs/ + CurrentSong.src.split("/").slice(-1)[0]);
    if ((index + 1) < songs.length) {
        console.log(index);
        playMusic(songs[index + 1]);
    } else {
        playMusic(songs[0]);
    }
});

const profileBtn = document.getElementById("profile-button");
const menu = document.getElementById("profilemenu");

// Toggle menu
profileBtn.addEventListener("click", function (e) {
    e.stopPropagation(); // prevent immediate closing
    menu.classList.toggle("hidden");
});

// Prevent menu click from closing it
menu.addEventListener("click", function (e) {
    e.stopPropagation();
});

// Close when clicking outside
document.addEventListener("click", function () {
    menu.classList.add("hidden");
});

document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
    console.log(e, e.target, e.target.value);
    CurrentSong.volume = parseInt(e.target.value)/100;
})

const closebutton = document.querySelector(".close-logo");
const right = document.querySelector(".right");

closebutton.addEventListener("click", ()=>{
    right.classList.toggle("closed");
})