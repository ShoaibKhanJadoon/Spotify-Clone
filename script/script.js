

async function getSongs() {
    try {
        let response = await fetch('http://127.0.0.1:5500/songs');
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


// main function
var currentsong = new Audio()

async function main() {

    let songs = await getSongs();
    let songol = document.querySelector(".songList").getElementsByTagName("ol")[0]
    for (const song of songs) {

        songol.innerHTML = songol.innerHTML + `<li>
                       <div class="songListli">
                                    <span>
                                        ${song.replaceAll("%20", " ").split(".mp3")[0]}
                                    </span>
                                    <div class="invert">
                                        <img src="images/buttons/play.svg" alt="">
                                    </div>
                        </div>         
        
                        </li>`;
    }
    //playAudio(songs);
    const liElements = document.querySelector(".songList ol").getElementsByTagName("li");

    Array.from(liElements).forEach(li => {

        li.addEventListener("click", element => {
            const songName = li.querySelector(".songListli span").textContent.trim();
            if (currentsong.paused ) {
                currentsong.pause()
                playAudio(songName)
                console.log(element)
                li.querySelector(".songListli div img").src="images/buttons/pause.svg"
                let playbarbutton=document.querySelector(".playbarbuttons div ").children[1];
                playbarbutton.src="images/buttons/pause.svg"
            
            }
            
            else {
                currentsong.pause()
                li.querySelector(".songListli div img").src="images/buttons/play.svg"
                let playbarbutton=document.querySelector(".playbarbuttons div ").children[1];
                playbarbutton.src="images/buttons/play.svg"
            }

            Array.from(liElements).forEach(otherLi => {
                if (otherLi !== li) {
                    otherLi.querySelector(".songListli div img").src = "images/buttons/play.svg";
                }
            });
        });
    });
}
main()

function playAudio(song) {
    currentsong.src = `songs/${song}.mp3`;
    // Play the audio
    currentsong.play()
    //log the duration once metadata is loaded
    currentsong.addEventListener('loadedmetadata', function () {
        const duration = currentsong.duration; // duration in seconds
        console.log("Song Duration: " + duration + " seconds current src=" + currentsong.currentSrc + "current time" + currentsong.currentTime);
    });

}
  


