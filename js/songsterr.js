var sp = getSpotifyApi();
var models = sp.require('$api/models');
// Spotify player
var player = models.player;

init();

function init() {

    tabs();
    models.application.observe(models.EVENT.ARGUMENTSCHANGED, tabs);

    var playingDiv = document.getElementById("playing");
    // Initialize Track Details and Guitar Tabs
    //updatePageWithTrackDetails();
    songsterrRequest(player.track);
    player.observe(models.EVENT.CHANGE, function(e) {
        // Only update the page if the track changed
        if (e.data.curtrack == true) {
           //updatePageWithTrackDetails();
           songsterrRequest(player.track);
        }
    });

}

function tabs() {
    var args = models.application.arguments;
    var current = document.getElementById(args[0]);
    var sections = document.getElementsByClassName('section');
    for (var i=0, l = sections.length; i<l; i++){
        if (current != sections[i]) {
            sections[i].style.display = 'none';
        }
    }
    current.style.display = 'block';
}

function updatePageWithTrackDetails() {

    var header = document.getElementById("nowPlaying");

    // This will be null if nothing is playing.
    var playerTrackInfo = player.track;

    if (playerTrackInfo == null) {
        header.innerText = "Nothing playing!";
    } else {
        var track = playerTrackInfo.data;
        header.innerHTML = "<p><b>Now Playing:</b></p> <b>" + track.name + "</b><p>on the album <b>" + track.album.name + "</b></p>by <b>" + track.album.artist.name + "</b>.";
    }
}

function songsterrRequest(track) {
    var artistName = track.album.artist.name;
    var trackName = track.name;

    var request = ("http://www.songsterr.com/a/wa/bestMatchForQueryString?s=" + trackName + "&a=" + artistName);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', request);
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        var data = xhr.responseText;
        handle(data);
    };
    xhr.send(null);

    function handle(data) {
        var $data = $(data);

        var $text = $data.find("[title$='text version']");
        var $chords = $data.find("[title$='chords version']");
        if ($text.length > 0) {
            window.frames['tabs_frame'].document.location.href = ("http://www.songsterr.com" + $text.attr('href'));
        }
        else {
            $text = $data.find(".text-tab-wrapper");
            if ($text.length > 0) {
                window.frames['tabs_frame'].document.location.href = request;
            }
            else {
                window.frames['tabs_frame'].document.location.href = ("http://www.songsterr.com");
            }
        }
        if ($chords.length > 0) {
            window.frames['chords_frame'].document.location.href = ("http://www.songsterr.com" + $chords.attr('href'));
        }
        else {
            $chords = $data.find(".chords-wrapper");
            if ($chords.length > 0) {
                window.frames['chords_frame'].document.location.href = request;
            }
            else {
                window.frames['chords_frame'].document.location.href = ("http://www.songsterr.com");
            }
        }
    }

}