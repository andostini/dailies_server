function toggleCam(streamKey) {
  var div = document.getElementById("col" + streamKey);
  var button = document.getElementById("button" + streamKey);
  if (div.style.display == "block") {    //disble
    div.style.display = "none";
    button.classList.remove("btn-outline-primary");
    button.classList.add("btn-outline-secondary");
  }
  else {    //enable
    div.style.display = "block";
    button.classList.remove("btn-outline-secondary");
    button.classList.add("btn-outline-primary");
  }

  var number = getToggledCams().number;
  if (number == 1) {
    changeColWidth('col-12');
    getToggledCams().docs[0].classList.add("fullscreen");
  }
  else if (number == 2 ) {
    if(window.innerHeight > window.innerWidth){    //PORTRAIT VIEW
      changeColWidth('col-12');
    }
    else {
      changeColWidth('col-6');  // LANDSCAPE VIEW
    }
  }
  else if (number > 2) {
    changeColWidth('col-6');
  }

  if (number == 0) {
    document.getElementById("noCamEnabled").style.display = "block";
  }
  else {
    document.getElementById("noCamEnabled").style.display = "none";
  }
}

window.addEventListener("resize", function() {
  console.log("CHANGE");
  if (getToggledCams().number == 2) {
    if(window.innerHeight > window.innerWidth){    //PORTRAIT VIEW
      changeColWidth('col-12');
    }
    else {
      changeColWidth('col-6');  // LANDSCAPE VIEW
    }
  }

});


function getToggledCams() {
  var ret = {
    number: 0,
    docs: []
  }
  if (document.getElementById("colA").style.display != "none") { ret.number++; ret.docs.push(document.getElementById("colA"))}
  if (document.getElementById("colB").style.display  != "none") { ret.number++;  ret.docs.push(document.getElementById("colB"))}
  if (document.getElementById("colC").style.display  != "none") { ret.number++;  ret.docs.push(document.getElementById("colC"))}
  if (document.getElementById("colD").style.display  != "none") { ret.number++;  ret.docs.push(document.getElementById("colD"))}
  return ret;
}

function changeColWidth(col) {
  document.getElementById("colA").classList = [];
  document.getElementById("colA").classList.add(col);
  document.getElementById("colB").classList = [];
  document.getElementById("colB").classList.add(col);
  document.getElementById("colC").classList = [];
  document.getElementById("colC").classList.add(col);
  document.getElementById("colD").classList = [];
  document.getElementById("colD").classList.add(col);
}
document.getElementById('libloader').style.display = 'none'
toggleCam("A");
