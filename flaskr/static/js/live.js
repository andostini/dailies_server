

var liveStreams = {
	A: {
		player: null,
		state: "initialising"
	},
	B: {
		player: null,
		state: "initialising"
	},
	C: {
		player: null,
		state: "initialising"
	},
	D: {
		player: null,
		state: "initialising"
	}
}

if (document.getElementById("liveStreamA") != null) {
	liveStreams.A.player = videojs("liveStreamA");
}

if (document.getElementById("liveStreamB") != null) {
	liveStreams.B.player = videojs("liveStreamB");
}

if (document.getElementById("liveStreamC") != null) {
	liveStreams.C.player = videojs("liveStreamC");
}

if (document.getElementById("liveStreamD") != null) {
	liveStreams.D.player = videojs("liveStreamD");
}

var StreamKeyIter = 0;
streamKeys = ["A","B","C","D"];

function nextStreamKey() {
	StreamKeyIter++;
	if (StreamKeyIter >= 4) {
		StreamKeyIter = 0;
	}
	return streamKeys[StreamKeyIter];
}

function checkLiveStream(streamKey) {
	url = "https://stream.franconia-film.de/hls/" + projectId + "-camera" + streamKey + ".m3u8";
	if (document.getElementById("liveStream" + streamKey) != null) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				if (liveStreams[streamKey].state != 'Online') {     //Stream changes from Off- to Online
					liveStreams[streamKey].player.src({type: 'application/x-mpegURL', src: url});
					liveStreams[streamKey].state = 'Online';

					document.getElementById("streamStatus" + streamKey).innerHTML = '<span style="color: green"> Online </span>';
					if (!liveStreams[streamKey].player.paused()) {
						liveStreams[streamKey].player.play();
					}

				}
				console.log(streamKey + ' is online');
	      setTimeout(function() { checkLiveStream(nextStreamKey()) }, 2000);
		  }

			else if (this.readyState == 4 && this.status == 404) {
				if (liveStreams[streamKey].state != 'Offline') {     //Stream changes from On- to Offline
					liveStreams[streamKey].player.src({type: 'video/mp4', src: "../static/video/fallbackLive" + streamKey + ".mp4"});
					liveStreams[streamKey].state = 'Offline';
					document.getElementById("streamStatus" + streamKey).innerHTML = '<span style="color: red"> Offline </span>';
					if (!liveStreams[streamKey].player.paused()) {
						liveStreams[streamKey].player.play();
					}
				}
				console.log(streamKey + " is offfline");
	      setTimeout(function() { checkLiveStream(nextStreamKey()) }, 2000);
			}
		};
		xhttp.open("GET", url, true);
		xhttp.send();
	}
	else {
		console.log(streamKey + ' is from other live source');
		document.getElementById("streamStatus" + streamKey).innerHTML = '<span style="color: yellow"> Foreign Source </span>';
		checkLiveStream(nextStreamKey());
	}
}



checkLiveStream("A");
