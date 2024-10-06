

async function getSongs(folder) {
    try {
        let response = await fetch(`http://127.0.0.1:5500/${folder}`);
        if (!response.ok) {
            throw new Error(`html error ${response.status}`);
        }
        response = await response.text()
        // console.log(response)
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName("a");
        let songs = []
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith('mp3')) {
                songs.push(element.href.split("/songs/")[1])
            }
        }
        return songs;

    } catch (error) {
        console.error(`error fectching data${error}`)
    }

}
async function displayAlbum(){
    let response=await fetch("http://127.0.0.1:5500/songs");
    if(!response.ok){
        throw new Error(`html error ${response.status}`);
    }
    else{
        response=await response.text();
        let div =document.createElement("div");
        div.innerHTML=response;
        let anchors=div.getElementsByTagName("a")
        Array.from(anchors).forEach(async e=>{
            if(e.href.includes("songs/")){
                let foldername=(e.href.split("songs/")[1])
                let response=await fetch(`http://127.0.0.1:5500/songs/${foldername}/info.json`);
                if(!response.ok){
                    throw new Error(`html error ${response.status}`);
                }
                else{
                    response=await response.json()
                    let playlistcardcontainer=document.querySelector(".spotifyPlaylistContainer");
                    
                    playlistcardcontainer.innerHTML=playlistcardcontainer.innerHTML+`<div data-folder="${foldername}" class="playlistcard ">
                            <img src="songs/${foldername}/cover.jfif" alt="">
                            <button><img src="images/playbutton.svg" alt=""></button>
                            <p>Title: ${response.title}</p>
                            <p>Title: ${response.description}</p>

                        </div>`

                }
            }
        })
        
    }
}

// global variables
let durationDivs = document.querySelectorAll(".duration div");
let currentsong = new Audio()
let songs, songName;
let folder;
let nextsong, previoussong;
let songol;

// main function
folder = "songs/cs"

async function main() {
    displayAlbum();

    // seekbar movement
    document.querySelector(".seekbar").addEventListener("click", e => {
        if (currentsong.src) {

            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".circle").style.left = percent + "%";
            currentsong.currentTime = (currentsong.duration * percent) / 100
        }

    });
    // load the playlist whenever card is clicked
    
    songs = await getSongs(folder);
    
    songol = document.querySelector(".songList").getElementsByTagName("ol")[0]
    
    for (let song of songs) {
        songol.innerHTML = songol.innerHTML + `<li>
                       <div class="songListli">
                                    <span>
                                        ${song.split("/")[1].replaceAll("%20", " ").split(".mp3")[0]}
                                    </span>
                                    <div class="invert">
                                        <img src="images/buttons/play.svg" alt="">
                                    </div>
                        </div>         
        
                        </li>`;
    }
    // let liElements = document.querySelector(".songList ol").getElementsByTagName("li");
    let playbarbutton = document.querySelector(".playbarbuttons div ").getElementsByTagName("img")[1];
    let currentselectedlist = null; // Variable to track the currently selected list item

    // Playbar button click handler
    playbarbutton.addEventListener("click", () => {
        if (!currentsong.src) {

        }
        else if (currentsong.paused) {
            currentsong.play();
            playbarbutton.src = "images/buttons/pause.svg";
            if (currentselectedlist) {
                currentselectedlist.src = "images/buttons/pause.svg"
            }
        } else {
            currentsong.pause();
            playbarbutton.src = "images/buttons/play.svg";
            if (currentselectedlist) {
                currentselectedlist.src = "images/buttons/play.svg"
            }
        }
    });
    // Event delegation for song list
    document.querySelector(".songList").addEventListener("click", e => {
        if (e.target.closest("li")) {
            let li = e.target.closest("li");
            // console.log(li)
            songName = li.querySelector(".songListli span").textContent.trim();
            songName = folder.split("/")[1] + "/" + songName;
            let currentsongname = `${songName}.mp3`;

            let mycurrentsong = null;
            if (currentsong.src) {
                mycurrentsong = currentsong.src.split("/songs/")[1];
                mycurrentsong = mycurrentsong.replaceAll("%20", " ");
            }

            if (!currentsong.src || currentsongname !== mycurrentsong) {
                currentselectedlist = li.querySelector(".songListli div img");
                currentselectedlist.src = "images/buttons/pause.svg";
                let playbarbutton = document.querySelector(".playbarbuttons div ").getElementsByTagName("img")[1];
                playbarbutton.src = "images/buttons/pause.svg";
                playAudio(songName);
            } else if (currentsong.paused) {
                currentsong.play();
                currentselectedlist.src = "images/buttons/pause.svg";
                let playbarbutton = document.querySelector(".playbarbuttons div ").getElementsByTagName("img")[1];
                playbarbutton.src = "images/buttons/pause.svg";
            } else {
                currentsong.pause();
                currentselectedlist.src = "images/buttons/play.svg";
                let playbarbutton = document.querySelector(".playbarbuttons div ").getElementsByTagName("img")[1];
                playbarbutton.src = "images/buttons/play.svg";
            }

            // Reset other play icons
            Array.from(document.querySelectorAll(".songListli div img")).forEach(otherImg => {
                if (otherImg !== currentselectedlist) {
                    otherImg.src = "images/buttons/play.svg";
                }
            });
        }
    });


    
    // previous button playbarbutton
    let previous = document.querySelector(".playbarbuttonsimages").getElementsByTagName("img")[0];
    previous.addEventListener("click", e => {
        let index;
        let songlength = songs.length - 1;
        if (currentsong.src) {
            index = songs.indexOf(currentsong.src.split("songs/")[1])
            if (index == 0) {
                document.querySelector(".info").innerHTML = "No Previous Song"

                setTimeout(function () {
                    document.querySelector(".info").innerHTML = songName.split("/")[1]

                }, 1500);

            }
            else {
                previoussong = songs[index - 1].replaceAll("%20", " ").split(".mp3")[0];

                playAudio(previoussong)

            }

        }

    });
    // next button playbarbutton
    let next = document.querySelector(".playbarbuttonsimages").getElementsByTagName("img")[2];
    next.addEventListener("click", e => {
        let index;
        let songlength = songs.length - 1;
        if (currentsong.src) {
            index = songs.indexOf(currentsong.src.split("songs/")[1])
            if (index == songlength) {
                document.querySelector(".info").innerHTML = "No Next Song"

                setTimeout(function () {
                    document.querySelector(".info").innerHTML = songName.split("/")[1]

                }, 1500);

            }
            else {
                nextsong = songs[index + 1].replaceAll("%20", " ").split(".mp3")[0];

                playAudio(nextsong)

            }

        }

    });
    // volume event listener
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e => {
        if (currentsong.src) {
            currentsong.volume = parseInt(e.target.value) / 100
        }
    });
}
main()

function playAudio(song) {
    currentsong.src = `songs/${song}.mp3`;


    console.log(song)
    document.querySelector(".info").innerHTML = song.split("/")[1]
    durationDivs[0].innerHTML = ''; // Reset current time
    durationDivs[1].innerHTML = ''; // Reset duration

    // Play the audio
    currentsong.play()
    //log the duration once metadata is loaded
    var duration;
    currentsong.addEventListener('loadedmetadata', function () {

        duration = currentsong.duration; // duration in seconds
        const formattedDuration = formatTime(duration); // Convert duration to hh:mm:ss
        console.log("Song Duration: " + formattedDuration);
        durationDivs[0].innerHTML = formattedDuration + "/";
    });
    currentsong.addEventListener("timeupdate", () => {

        const currentTime = currentsong.currentTime; // current time in seconds
        const formattedCurrentTime = formatTime(currentTime); // Convert current time    
        durationDivs[1].innerHTML = formattedCurrentTime
        document.querySelector(".circle").style.left = (currentTime / duration * 100) + "%"

    });
}
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
        // Format with hours included
        return [
            hrs.toString().padStart(2, '0'),
            mins.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');
    } else if (mins > 0) {
        // Format with minutes and seconds
        return [
            mins.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');
    } else {
        // Format with only seconds
        return [
            "00",
            secs.toString().padStart(2, '0')
        ].join(":")
    }
}

document.querySelector(".spotifyPlaylistContainer").addEventListener("click",async e=>{
    if(e.target.closest(".playlistcard")){
        let playlistcard=e.target.closest(".playlistcard");
        
        folder = `songs/${playlistcard.dataset.folder}`
        songs = await getSongs(folder);
        console.log(songs)
        songol = document.querySelector(".songList").getElementsByTagName("ol")[0]
        songol.innerHTML=""
        for (let song of songs) {
            songol.innerHTML = songol.innerHTML + `<li>
                   <div class="songListli">
                                <span>
                                    ${song.split("/")[1].replaceAll("%20", " ").split(".mp3")[0]}
                                </span>
                                <div class="invert">
                                    <img src="images/buttons/play.svg" alt="">
                                </div>
                    </div>         
                    </li>`;
        }
       
    }
});




