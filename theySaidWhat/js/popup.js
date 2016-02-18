document.addEventListener('DOMContentLoaded', function() {

  loadOptions();

  var highlightChange = function() {
    saveOptions();
    console.log("this shit happens 1");

    chrome.runtime.sendMessage({
        "message": "returnOptions",
        "remove": false
    });
  }; 

  document.querySelector('#checkboxHighlightGender').addEventListener('change', highlightChange);

  // chrome.runtime.sendMessage({
  //       "message": "returnOptions",
  //       "remove": !(box.target.checked)
  // });

}, false);



