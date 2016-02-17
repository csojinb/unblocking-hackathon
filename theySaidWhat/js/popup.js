document.addEventListener('DOMContentLoaded', function() {

  loadOptions();

  var highlightChange = function(box) {
    saveOptions();
    chrome.tabs.sendMessage({
        "message": "returnOptions",
        "remove": box.target.checked
    });
  };

  document.querySelector('#checkboxHighlightGender').addEventListener('change', highlightChange);

}, false);