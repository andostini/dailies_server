function showSettings(element) {

  element = element.parentElement;

  element = element.lastElementChild;

  display = element.style.display;


  if (display == "block") {element.style.display = "none";}
  else { element.style.display = 'block'}



}
