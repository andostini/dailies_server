var socket;
$(document).ready(function(){
    socket = io.connect('http://' + document.domain + ':' + location.port + '/');
    socket.on('connect', function() {
        socket.emit('joined', { room: room });
    });
    socket.on('status', function(data) {
        $('#chat').val($('#chat').val() + '<' + data.msg + '>\n');
        $('#chat').scrollTop($('#chat')[0].scrollHeight);
    });
    socket.on('message', function(data) {
        $('#chat').val($('#chat').val() + data.msg + '\n');
        $('#chat').scrollTop($('#chat')[0].scrollHeight);
    });
    /*$('#chatMsg').keypress(function(e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            text = $('#chatMsg').val();
            $('#chatMsg').val('');
            socket.emit('chatMsg', {msg: text, room: room });
        }
    });*/
});

class CovideoChat {
  constructor(room) {
    this.room = room;
  }
  get() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("chatContainer").innerHTML = this.responseText;
      }
    };
    xhttp.open("GET", "/chat/" + this.room, true);
    xhttp.send();
  }

  enter() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("chatContainer").innerHTML = this.responseText;

        location.reload();
      }
    };
    xhttp.open("POST", "/chat/" + this.room, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("chatName=" + document.getElementById('inputChatName').value);
  }
  leave() {
    socket.emit('left', {room: room }, function() {
        socket.disconnect();
    });
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("chatContainer").innerHTML = this.responseText;
      }
    };
    xhttp.open("GET", "/chat/leave/" + this.room, true);
    xhttp.send();
  }
  send(msg) {
    if(event.key === 'Enter') {
        socket.emit('text', {msg: msg, room: this.room });
        document.getElementById('chatMsg').value = "";
    }
  }
}
