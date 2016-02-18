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

    //occurrences++;
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
      namearray = name_map.names;

      
      for (i=0; i<namearray.length; i++) {
        console.log(namearray[i].gender);
        gender = namearray[i].gender;
        color = getColorForGender(namearray[i].gender);

        var pos = node.data.toLowerCase().indexOf(namearray[i].name);
        if (0 <= pos) {
          color_options = { "foreground": "#FF0000", "background": "#FF0000" };
          //color_options = { "foreground": color, "background": "#FBDE0F" };
          highlight(node, pos, namearray[i].name, color_options);
          skip = 1;
        }
      }

    }



    else if (1 == node.nodeType && !/(script|style|textarea)/i.test(node.tagName) && node.childNodes) {
      for (i = 0; i < node.childNodes.length; i++) {
        i += addHighlights(node.childNodes[i], name_map);
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
    // var xhr = new XMLHttpRequest();
    // xhr.onreadystatechange = function() {
    //   if (xhr.readyState == 4 && xhr.status == 200) {
    //       addHighlights(document.body, JSON.parse(xhr.responseText));
    //       // TODO: fill the table in the popup here
    //   }
    // }

    // xhr.open("POST", "http://name-extractor-api.herokuapp.com/extract-names/", true);
    // xhr.setRequestHeader("Content-Type", "application/json");
    // request_body = JSON.stringify({"text":text});
    // xhr.send(request_body);

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      addHighlights(document.body, JSON.parse(xhttp.responseText));
    }
  };
  xhttp.open("POST","https://name-extractor-api.herokuapp.com/extract-names/", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send('{"text": "Allie Meng"}');
  }

  if (remove) {
    removeHighlights(document.body);
  }



  var pageText = document.body.textContent || document.body.innerText;
  if ("undefined" != pageText) {
    //addHighlights(document.body, {"premium":"male"});
    getGenderMapForPageText(pageText);
  }  
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if ("returnOptions" == request.message) {
      genderHighlighter(request.remove);
      console.log("this shit happens 2");
      
  }
});

chrome.runtime.sendMessage({
  "message": "getOptions",
  "remove": false
});