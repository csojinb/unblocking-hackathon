function genderHighlighter(remove) {
  // remove : is this a call to remoe highlights

  // Based on "highlight: JavaScript text higlighting jQuery plugin" by Johann Burkard.
  // http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
  // MIT license.
  function highlight(node, pos, keyword, options) {
    var span = document.createElement("span");
    span.className = "highlighted";
    span.style.color = options.foreground;
    span.style.backgroundColor = options.background;

    var highlighted = node.splitText(pos);
    /*var afterHighlighted = */highlighted.splitText(keyword.length);
    var highlightedClone = highlighted.cloneNode(true);

    span.appendChild(highlightedClone);
    highlighted.parentNode.replaceChild(span, highlighted);

    occurrences++;
  }

  function getColorForGender(gender) {
    // gender : string gender

    // first generate a consistent hash of the gender
    var hash = 0, i, chr, len;
    if (gender.length === 0) return hash;
    for (i = 0, len = gender.length; i < len; i++) {
      chr   = gender.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }

    // then lets turn it into a hex string.
    var hashString = hash.toString(16);

    // let's pad it with leading zeroes as needed to be 6 long for color
    while (hashString.length < 6) hashString = "0" + hashString;

    // add the expected # in the front
    colorString = "#" + hashString;

    return colorString;
  }

  function addHighlights(node, name_map) {
    // node: document node to start at
    // name_map: map of {name: gender, ...}

    var skip = 0;

    var i;
    if (3 == node.nodeType) {
      for (name in name_map) {
        gender = name_map[name];
        color = getColorForGender(gender);

        var pos = node.data.toLowerCase.indexOf(name);
        if (0 <= pos) {
          color_options = { "foreground": color, "background": "#FBDE0F" };
          highlight(node, pos, name, color_options);
          skip = 1;
        }
      }

    }
    else if (1 == node.nodeType && !/(script|style|textarea)/i.test(node.tagName) && node.childNodes) {
      for (i = 0; i < node.childNodes.length; i++) {
        i += addHighlights(node.childNodes[i], keywords, options);
      }
    }

    return skip;
  }

  function removeHighlights(node) {
    var span;
    while (span = node.querySelector("span.highlighted")) {
      span.outerHTML = span.innerHTML;
    }
  }

  function getGenderMapForPageText(text) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
          addHighlights(document.body, JSON.parse(xhr.responseText));
          // TODO: fill the table in the popup here
      }
    }

    xhr.open("POST", "http://name-extractor-api.herokuapp.com/extract-names/", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    request_body = JSON.stringify({"text":text});
    xhr.send(request_body)

  }

  if (remove) {
    removeHighlights(document.body);
  } else {
    var pageText = document.body.textContent || document.body.innerText;
    if ("undefined" != pageText) {
      getGenderMapForPageText(pageText);
    }  
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if ("returnOptions" == request.message) {
    if ("undefined" != typeof request.keywords && request.keywords) {
      genderHighlighter(request.remove);
    }
  }
});

chrome.runtime.sendMessage({
  "message": "getOptions",
  "remove": false
});