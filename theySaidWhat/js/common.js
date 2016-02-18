function loadOptions() {
  if ("undefined" != typeof localStorage) {
  	console.log("i made it");
    var highlightGender = localStorage.getItem("highlightGender");
    highlightGender = "true" == highlightGender || null == highlightGender;
    document.getElementById("checkboxHighlightGender").checked = highlightGender;
  }
}

function saveOptions() {
  if ("undefined" != typeof localStorage) {
    localStorage.setItem("highlightGender", document.getElementById("checkboxHighlightGender").checked);
  }
}
