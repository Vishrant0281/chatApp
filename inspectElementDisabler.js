// inspect Element Disabler script
document.onkeydown = function(e) {
  if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)){
    return false;
  }
}
document.addEventListener('contextmenu', event => event.preventDefault()); //right click disabler