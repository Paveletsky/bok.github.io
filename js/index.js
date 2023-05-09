//Array randomizer (Fisher-Yates algorithm)
function shuffle(array) {
var currentIndex = array.length, temporaryValue, randomIndex ;

while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
}

return array;
}

var youtubePlayer;
var actualMusic = -1;

$(function() {
    if (l_bgImagesRandom)
        l_bgImages = shuffle(l_bgImages);

    if (l_musicRandom)
        l_musicPlaylist = shuffle(l_musicPlaylist);

    if (l_music) {
        loadYoutube();
        if (l_musicDisplay)
            $("#music").fadeIn(2000);
    }

    $("#overlay").css("background-image", "url('images/overlay.png')");
    $("#overlay").css("background-color", "rgba(0,0,0, 0.2)");

    $.backstretch(l_bgImages, {duration: 4000, fade: 3000});
});

function loadYoutube() {
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
    youtubePlayer = new YT.Player('player', {
    height: '0',
    width: '0',
    events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
    }
    });
}

function onPlayerReady(event) {
    youtubePlayer.setVolume(l_musicVolume);
    if (youtubePlayer.isMuted()) youtubePlayer.unMute();
    nextMusic();
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        nextMusic();
    }
}

function nextMusic() {
    actualMusic++;

    if (actualMusic >= l_musicPlaylist.length) {
        actualMusic = 0;
    }

    var atual = l_musicPlaylist[actualMusic];

    if (atual.youtube) {
        youtubePlayer.loadVideoById(atual.youtube);
    }else{
        $("body").append('<audio src="'+atual.ogg+'" autoplay>');
        $("audio").prop('volume', l_musicVolume/100);
        $("audio").bind("ended", function() {
            $(this).remove();
            nextMusic();
        });
    }
}