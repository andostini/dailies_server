

function makeMetaEditorItem(entry){

  //Make Label List, with current Label selected
  var label = ['', 'waste_clip', 'normal_take', 'good_take', 'fav_take'];
  var optionsHtml = "";
  for (x in label) {
    if (label[x] == entry['label']) {
      optionsHtml += '<option selected value="' + label[x] + '">' + label[x] + '</option>'
    }
    else {
      optionsHtml += '<option value="' + label[x] + '">' + label[x] + '</option>'
    }
  }


  var HTML = ' \
    <tr> \
      <td><input onfocusout="setMetadata(\'' + entry['clipname'] + '\', \'clipname\', this.value)" class="form-control form-control-sm covideo" type="input" name="clipname" onclick="" value="' + entry['clipname'] + '"></td> \
      <td><input onfocusout="setMetadata(\'' + entry['clipname'] + '\', \'scene\', this.value)"class="form-control form-control-sm covideo" type="input" name="scene" onclick="" value="' + entry['scene'] + '"></td> \
      <td><input onfocusout="setMetadata(\'' + entry['clipname'] + '\', \'shot\', this.value)"class="form-control form-control-sm covideo" type="input" name="shot" onclick="" value="' + entry['shot'] + '"></td> \
      <td><input onfocusout="setMetadata(\'' + entry['clipname'] + '\', \'take\', this.value)"class="form-control form-control-sm covideo" type="input" name="take" onclick="" value="' + entry['take'] + '"></td> \
      <td><input onfocusout="setMetadata(\'' + entry['clipname'] + '\', \'camera\', this.value)"class="form-control form-control-sm covideo camera' + entry['camera'] + '" type="input" name="camera" onclick="" value="' + entry['camera'] + '"></td> \
      <td><input onfocusout="setMetadata(\'' + entry['clipname'] + '\', \'reel\', this.value)"class="form-control form-control-sm covideo" type="input" name="reel" onclick="" value="' + entry['reel'] + '"></td> \
      <td><textarea onfocusout="setMetadata(\'' + entry['clipname'] + '\', \'comment\', this.value)"class="form-control form-control-sm covideo" name="comment" rows="1">' + entry['comment'] + '</textarea></td> \
      <td> \
        <select onchange="setMetadata(\'' + entry['clipname'] + '\', \'label\', this.value)" class="custom-select custom-select-sm covideo"> \
          ' + optionsHtml + ' \
      </td> \
      <td><textarea class="form-control form-control-sm covideo" name="cameraMeta" rows="1">' + JSON.stringify(entry['cameraMeta']) + '</textarea></td> \
      <td style="vertical-align: middle"><button onclick="deleteEntry(\'' + entry['clipname'] + '\')" type="button" class="btn btn-danger"><i class="far fa-trash-alt"></i></button></td> \
    </tr> \
  ';
  document.getElementById('metaeditor').innerHTML += HTML;
}


function getmetaeditor() {
  document.getElementById('metaeditor').innerHTML = "";
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var rsp = JSON.parse(this.responseText);
      for(i = 0; i < rsp.length; i++) {
        if (rsp[i]['clipname'] != "__init") {
          makeMetaEditorItem(rsp[i]);
        }
      }
    }
  }
  xhttp.open("POST", "../../api/get_CovideoLibrary/" + projectId, true);
  xhttp.send();
}

function setMetadata(clipname, att, value) {
  //document.getElementById('loading_block').style.display = "block";

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      document.getElementById('responseText').innerText = this.responseText;
      getmetaeditor()
    }

  }
  xhttp.open("POST", "../../api/setMetadata/" + projectId + "", true);

  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify({
    'clipname': clipname,
    'att' : att,
    'value' : value
  }));
}

function addEntry() {
  var newEntry = {
    "clipname" : document.getElementById('new_clipname').value,
    "scene" : document.getElementById('new_scene').value,
    "shot" : document.getElementById('new_shot').value,
    "take" : document.getElementById('new_take').value,
    "camera" : document.getElementById('new_camera').value,
    "reel" : document.getElementById('new_reel').value,
    "comment" : document.getElementById('new_comment').value,
    "label" : document.getElementById('new_label').value
  };

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById('responseText').innerText = this.responseText;
      getmetaeditor()
    }
  }
  xhttp.open("POST", "../../api/addEntry/" + projectId, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(newEntry));
}

function deleteEntry(clipname) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById('responseText').innerText = this.responseText;
      getmetaeditor()
    }
  }
  xhttp.open("POST", "../../api/deleteEntry/" + projectId, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify({
    'clipname': clipname
  }));
}
