function loadOptions() {
  if ("undefined" != typeof localStorage) {
    var highlightGender = localStorage.getItem("highlightGender");
    highlightGender = "true" == highlightGender || null == highlightGender;
    document.getElementById("checkboxHighlightGender").checked = false;
  }
}

function saveOptions() {
  if ("undefined" != typeof localStorage) {
    localStorage.setItem("highlightGender", document.getElementById("checkboxHighlightGender").checked);
  }
}
