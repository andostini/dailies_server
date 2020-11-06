var Covideo_Library = [];




function CovideoPlayer_tabbing(camera) {
  var tabs = document.getElementsByClassName('CovideoPlayerTab');
  var tab;
  for (tab of tabs) {
    tab.style.display = "none";
  }
  document.getElementById(camera).style.display = "block";

  var navs = document.getElementsByClassName('toggleCam');
  var nav;
  for (nav of navs) {
    nav.classList.remove('active');
  }
  //Pause Playbackvideo when switching back to live
  if (camera != 'Playback')  {

  }
}

function toggle_filterList() {
  display = document.getElementById('filterList').style.display;
  if (display == "block") {
    document.getElementById('filterList').style.display = "none";
    document.getElementById('filterList_icon').classList.remove('fa-caret-down');
    document.getElementById('filterList_icon').classList.add('fa-caret-right');
  }
  else {
    document.getElementById('filterList').style.display = "block";
    document.getElementById('filterList_icon').classList.remove('fa-caret-right');
    document.getElementById('filterList_icon').classList.add('fa-caret-down');
  }
}

function toggle_extendedMeta() {
  display = document.getElementById('extendedMeta').style.display;
  if (display == "block") {
    document.getElementById('extendedMeta').style.display = "none";
    document.getElementById('extendedMeta_icon').classList.remove('fa-caret-down');
    document.getElementById('extendedMeta_icon').classList.add('fa-caret-right');
  }
  else {
    document.getElementById('extendedMeta').style.display = "block";
    document.getElementById('extendedMeta_icon').classList.remove('fa-caret-right');
    document.getElementById('extendedMeta_icon').classList.add('fa-caret-down');
  }
}

function play(entry) {
  var carouselHTML = "";
  var carousel = "";
  var extendedMetaHTML = "";

  if (entry['stills'].length == 0) {
    carousel = "disabled";
  }

  for (i=0; i < entry['stills'].length; i++) {
    if (i == 0) {
      carouselHTML = carouselHTML + ' \
      <div class="active carousel-item"> \
        <img src="../static/projects/project-' + projectId + '/stills/' + entry['stills'][i] + '" class="d-block w-100"> \
      </div>  ';
    }
    else {
      carouselHTML = carouselHTML + ' \
      <div class="carousel-item"> \
        <img src="../static/projects/project-' + projectId + '/stills/' + entry['stills'][i] + '" class="d-block w-100"> \
      </div>  ';
    }
  }

  try {
    entry['cameraMeta'] = JSON.parse(entry['cameraMeta']);
  }
  catch(err) {
    extendedMetaHTML = 'Could not parse Extended Meta. See <a href="https://www.w3schools.com/js/js_json_syntax.asp" target="_blank" >here</a> for help'
  }
  var keys = Object.keys(entry['cameraMeta']);

  for (const key of keys) {
    extendedMetaHTML = extendedMetaHTML + '<tr><th class="pt-4" colspan="2"><h5>' + key + '</h5></th></tr>';

    var subkeys = Object.keys(entry['cameraMeta'][key]);
    for (const subkey of subkeys) {
      extendedMetaHTML = extendedMetaHTML + ' \
              <tr> \
                <td>' + subkey + '</td> \
                <td>' + entry['cameraMeta'][key][subkey] + '</td> \
              </tr>'
    }
  }

  var html = '<span class="text-muted display-4"><span class="camera' + entry['camera'] + '">' + entry['camera'] + '</span> / ' + entry['scene'] + ' - ' + entry['shot'] + ' - ' + entry['take'] + '</span><span style="float:right" class="badge badge-pill badge-primary ' + entry['label'] + '">' + entry['label'] + '</span><br> \
      <ul class="nav nav-tabs" id="myTab" role="tablist"> \
        <li class="nav-item"> \
          <a class="nav-link active" id="video-tab" data-toggle="tab" href="#video" role="tab" aria-controls="video" aria-selected="true">Video</a> \
        </li> \
        <li class="nav-item"> \
          <a class="nav-link ' + carousel + '" id="stills-tab" data-toggle="tab" href="#stills" role="tab" aria-controls="stills" aria-selected="false">Stills</a> \
        </li> \
      </ul> \
      <div class="tab-content pt-1" id="myTabContent"> \
        <div class="tab-pane fade show active" id="video" role="tabpanel" aria-labelledby="video-tab"> \
          <div id="playback_video_tag"> \
            <video style="width: 100%" controls> \
              <source src="../static/projects/project-' + projectId + '/video/' + entry['playbackfile'] + '"> \
            </video> \
          </div> \
        </div> \
        <div class="tab-pane fade" id="stills" role="tabpanel" aria-labelledby="stills-tab"> \
        <div id="carouselExampleControls" class="carousel slide" data-ride="carousel"> \
          <div class="carousel-inner"> \
            ' + carouselHTML + ' \
          </div> \
          <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev"> \
            <span class="carousel-control-prev-icon" aria-hidden="true"></span> \
            <span class="sr-only">Previous</span> \
          </a> \
          <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next"> \
            <span class="carousel-control-next-icon" aria-hidden="true"></span> \
            <span class="sr-only">Next</span> \
          </a> \
          </div>\
        </div> \
      </div> \
      <table class="table table-sm"> \
        <tr> \
          <th>clipname</th> \
          <td>' + entry['clipname'] + '</td> \
          <th>Reel</th> \
          <td>' + entry['reel'] + '</td> \
        </tr> \
        <tr> \
          <th>Scene</th> \
          <td>' + entry['scene'] + '</td> \
          <th>Camera</th> \
          <td class="camera' + entry['camera'] + '">' + entry['camera'] + '</td> \
        </tr> \
        <tr> \
          <th>Shot</th> \
          <td>' + entry['shot'] + '</td> \
          <th>Label</th> \
          <td>' + entry['label'] + '</td> \
        </tr> \
        <tr> \
          <th>Take</th> \
          <td>' + entry['take'] + '</td> \
          <th>Comment</th> \
          <td>' + entry['comment'] + '</td> \
        </tr> \
      </table> \
      <h4 onclick="toggle_extendedMeta()"><i id="extendedMeta_icon" class="fas fa-caret-right"></i>Extended Metadata</h4> \
      <div class="table-responsive-sm" id="extendedMeta" style="display: none"><table class="table table-sm">  \
        ' + extendedMetaHTML + ' \
      </table></div>';
    document.getElementById('Playback').innerHTML = html;
    CovideoPlayer_tabbing('Playback')
}

function get_CovideoLibrary() {

  document.getElementById('libloader').style.display="block";
  document.getElementById('playbackList').innerHTML = "";
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      Covideo_Library = JSON.parse(this.responseText);
      makeProjectLibrary('scene', 'asc');
      //call function recursivly after 5minutes
      setTimeout(function(){get_CovideoLibrary(); }, 20000);
    }
  }
  xhttp.open("POST", "../api/get_CovideoLibrary/" + projectId, true);
  xhttp.send();
  document.getElementById('libloader').style.display="none";

}

function makeListItem(entry, thumb) {
  var table = document.getElementById('playbackList');
  var row = document.createElement('tr');
  row.addEventListener('click', function() {
    play(entry);
  })
  var badges = ""
  if (entry['playbackfile'] != "") {
    badges = badges + '<i class="fas fa-video"></i>&nbsp;'
  }

  if (entry['stills'].length == 1) {
    badges = badges + '<i class="far fa-image"></i>'
  }
  else  if (entry['stills'].length > 1) {
    badges = badges + '<i class="far fa-images"></i>'
  }

  var thumbHTML ="";
  if (thumb) {
    thumbHTML = '<td><div class="thumbnail-list" style="background-image: URL(' + entry['thumbnail'] + ');"></div></td>';
  }

  row.innerHTML = '  \
    ' + thumbHTML + ' \
    <td>' + entry['scene'] + '</td> \
    <td>' + entry['shot'] + '</td> \
    <td>' + entry['take'] + '</td> \
    <td>' + entry['clipname'] + '</td> \
    <td class="camera' + entry['camera'] + '">' + entry['camera'] + '</td> \
    <td>' + entry['reel'] + '</td> \
    <td>' + badges + '</td> \
    <td><span class="badge badge-pill badge-primary ' + entry['label'] + '">' + entry['label'] + '</span></td> \
    <td></td>'


  return(row);
}

function sort_and_filter(key, direction) {
  var table = document.getElementById('playbackList');
  table.innerHTML= "";
  lib = Covideo_Library;

  // SORTING COVIDEO LIBRARY
  lib.sort(function(a,b) {
    val_a = a[key];
    val_b = b[key];
    val_a.toUpperCase();
    val_b.toUpperCase();

    var comparison = 0;
    if (val_a > val_b) {
      comparison = 1;
    }
    else if (val_b > val_a){
      comparison = -1;
    }
    //Alway sort for scene, shot and take it comp = 0;
    if (comparison == 0 && key != 'scene') {
        //Comparing Scenes
        val_a = a['scene']
        val_b = b['scene']
        val_a.toUpperCase();
        val_b.toUpperCase();

        if (val_a > val_b) {
          comparison = 1;
        }
        else if (val_b > val_a){
          comparison = -1;
        }
    }

    if (comparison == 0) {
      //Comparing Shots
      val_a = a['shot']
      val_b = b['shot']
      val_a.toUpperCase();
      val_b.toUpperCase();

      if (val_a > val_b) {
        comparison = 1;
      }
      else if (val_b > val_a){
        comparison = -1;
      }
    }

      //Comparing Takes
    if (comparison == 0) {
      val_a = a['take']
      val_b = b['take']
      val_a.toUpperCase();
      val_b.toUpperCase();

      if (val_a > val_b) {
        comparison = 1;
      }
      else if (val_b > val_a){
        comparison = -1;
      }
    }


    return comparison;
  });

  //FILTERING COVIDEO LIBRARY
  var filter = {
    'scene' : document.getElementById('filterByScene').value,
    'shot' : document.getElementById('filterByShot').value,
    'take' : document.getElementById('filterByTake').value,
    'clipname' : document.getElementById('filterByClipname').value,
    'camera' : document.getElementById('filterByCamera').value,
    'reel' : document.getElementById('filterByReel').value
  };
  var keys=Object.keys(filter);

  lib_filtered = []; //Creating new Lib instance which has been filtered because

  for (i=0; i< lib.length; i++) {
    allowed = true;
    for (j=0; j < keys.length; j++ ) {
      if (!lib[i][keys[j]].startsWith(filter[keys[j]])) {
        allowed = false;
      }

      //check, wether the label is selected in the filters
      else if (document.getElementById('filterBy_' + lib[i]['label']).checked == false) {
        allowed = false;
      }
    }
    if (allowed) {
      lib_filtered.push(lib[i]);
    }
  }
  if (direction == "desc") {
    lib_filtered.reverse();
  }

  return lib_filtered;
}

function makeProjectLibrary(key, direction) {
  lib = sort_and_filter(key, direction);
  //Disbale all three views to enable the right one when necessary
  document.getElementById('list-view').style.display = "none";
  document.getElementById('playbackList_thumbheader').style.display='none'
  document.getElementById('thumbnail-view').style.display = "none";

  //CREATE LIST VIEW
  if (document.getElementById('Toggle_list-view').checked) {
    var table = document.getElementById('playbackList');
    document.getElementById('list-view').style.display='block'
    for (i=0; i < lib.length; i++) {
      if (lib[i]['clipname'] != '__init') {
        table.append(makeListItem(lib[i], false));
      }
    }

  }

  // CREATE LIST-THUMBNAIL VIEW
  if (document.getElementById('Toggle_list-thumbnail-view').checked) {
    var table = document.getElementById('playbackList');
    document.getElementById('playbackList_thumbheader').style.display=''
    document.getElementById('list-view').style.display='block'
    for (i=0; i < lib.length; i++) {
      if (lib[i]['clipname'] != '__init') {
        table.append(makeListItem(lib[i], true));
      }
    }
  }

  // CREATE THUMBNAIL VIEW

  else if (document.getElementById('Toggle_thumbnail-view').checked) {
    var row  = document.getElementById('thumbnail-container');
    row.innerHTML = "";
    document.getElementById('thumbnail-view').style.display="";
    var col;
    for (i=0;i<lib.length; i++) {
      if (lib[i]['clipname'] != '__init') {
        row.append(makeThumbnailItem(lib[i]));
      }
    }
  }

}

function makeThumbnailItem(entry) {
  col = document.createElement('div');
  col.classList.add('p-2');
  col.addEventListener('click', function() {
    play(entry);
  });
  var badges = ""
  if (entry['playbackfile'] != "") {
    badges = badges + '<i class="fas fa-video"></i>&nbsp;'
  }

  if (entry['stills'].length == 1) {
    badges = badges + '<i class="far fa-image"></i>'
  }
  else  if (entry['stills'].length > 1) {
    badges = badges + '<i class="far fa-images"></i>'
  }
  col.innerHTML= '<div class="' + entry['label'] + ' thumbnail" style="width: 100%; background-image: URL(' + entry['thumbnail'] + ')"></div> \
    <span><span class="camera' + entry['camera'] + '">' + entry['camera'] + '</span> / ' + entry['scene'] + ' - ' + entry['shot'] + ' - ' + entry['take'] + '</span> \
    <span style="font-size: 10px; font-style:italic;">' + entry['clipname'] + '</span><br><span style="font-size: 12px">' + badges + '</span>';
  return col;
}
