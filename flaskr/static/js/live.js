
var liveStreams = {}
if (document.getElementById("liveStreamA") != null) {
	liveStreams.A = videojs('#liveStreamA');
	checkLiveStream("A");
}

if (document.getElementById("liveStreamB") != null) {
	liveStreams.B = videojs('#liveStreamB');
}

if (document.getElementById("liveStreamC") != null) {
	liveStreams.C = videojs('#liveStreamC');
}

if (document.getElementById("liveStreamD") != null) {
	liveStreams.D = videojs('#liveStreamD');
}


function checkLiveStream(streamKey) {
	url = "https://stream.franconia-film.de/hls/" + projectId + "-camera" + streamKey + ".m3u8";
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
			liveStreams[streamKey].src({type: 'application/x-mpegURL', src: url});
			console.log("Online");
	  }
		else if (this.readyState == 4 && this.status == 404) {
			liveStreams[streamKey].src({type: 'video/mp4', src: "../static/video/fallbackLive.mov"});
			console.log(liveStreams[streamKey]);
      setTimeout(function() { checkLiveStream(streamKey) }, 10000);
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}
