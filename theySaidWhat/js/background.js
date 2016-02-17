chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if ("getOptions" == request.message) {
    if ("undefined" != typeof localStorage) {
      chrome.tabs.query({
          "active": true,
          "currentWindow": true
        },
        function(tabs) {
          if ("undefined" != typeof tabs[0].id && tabs[0].id) {
            var highlightGender = localStorage.getItem("highlightGender");
            highlightGender = "true" == highlightGender || null == highlightGender;

            chrome.tabs.sendMessage(tabs[0].id, {
              "message": "returnOptions",
              "remove": request.remove
            });
          }
        }
      );
    }
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if ("highlightGender" == request.message) {
    var highlightGender = localStorage.getItem("highlightGender");
    highlightGender = "true" == highlightGender || null == highlightGender;
  }
});
