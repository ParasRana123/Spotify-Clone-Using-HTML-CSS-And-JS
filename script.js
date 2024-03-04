console.log("Let's write JavaScript");
let currentSong = new Audio();

// Through ChatGpt  
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(){
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs
}
getSongs();

// Function to play the songs
const playMusic = (track) => {
    // let audio = new Audio("/Songs/" + track);
    currentSong.src = "/Songs/" + track
    currentSong.play();
    play.src = "pause.svg"; // Jab ganna play hoga then by default we have to do this
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00.00 / 00.00"
}

async function main() {
    // Get the list of all songs....
    let songs = await getSongs();
    console.log(songs);
    
    // Show the songs in the Playlist section
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for(const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="music.svg" alt="">
        <div class="info">
          <div> ${song.replaceAll("%20" , " ")}</div>
          <div>Paras </div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="play.svg" alt="">
        </div></li>`;
    }

    // Attach an Event Listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=> {
       //  console.log(e);  // Will get all the li's containing the songs....
       // Now to get each song name and the artist name
       // console.log(e.getElementsByTagName("div")[0]);
       // Now to get only the song name
       e.addEventListener("click",element => {
        console.log(e.querySelector(".info").firstElementChild.innerHTML);
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
       })
    })

    // Attach an Event listener to play next and previous
    play.addEventListener("click" , () => {
        if(currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "play.svg";
        }
    })

    // Listen for time Update event
    currentSong.addEventListener("timeupdate" , () => {
        console.log(currentSong.currentTime , currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
    })

}
main();