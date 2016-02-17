function keywordsHighlighter(remove) {
	var occurrences = 0;

	// Based on "highlight: JavaScript text higlighting jQuery plugin" by Johann Burkard.
	// http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
	// MIT license.
	function highlight(node, pos, keyword, options) {
		var span = document.createElement("span");
		span.className = "highlighted";
		span.style.backgroundColor = options.background;

		var highlighted = node.splitText(pos);
		/*var afterHighlighted = */highlighted.splitText(keyword.length);
		var highlightedClone = highlighted.cloneNode(true);

		span.appendChild(highlightedClone);
		highlighted.parentNode.replaceChild(span, highlighted);

		occurrences++;
	}

	function highlightGenders(node, pos, keyword, gender) {
		if (gender == "male") {
			highlight(node, pos, keyword, {"background": "#0000CC"}); 
		}
		else if (gender == "female") {
			highlight(node, pos, keyword, {"background": "#CC0000"}); 
		}
		else {
			highlight(node, pos, keyword, {"background": "#00CC00"}); 
		}
	}

	function addHighlights(node, keywords, options) {
		var skip = 0;

		var i;
		if (3 == node.nodeType) {
			for (i = 0; i < keywords.length; i++) {
				var keyword = keywords[i].toLowerCase();
				var pos = node.data.toLowerCase().indexOf(keyword);
				if (0 <= pos) {
					highlight(node, pos, keyword, options);
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

		occurrences = 0;
	}

	if (remove) {
		removeHighlights(document.body);
	}

	// make a call to the api
	// make the call usaing an ajax function callback
	// in that function callback make it highlight shit

	function(apiurl, texts) {

		for keywords in response.keys
			addHighlights(document.body, keywords, options);


		xhttp.open("POST", apiurl, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send("fname=Henry&lname=Ford");

	}("http://name-extractor-api.herokuapp.com/extract-names/", document.body.textContent || document.body.innerText);

	chrome.runtime.sendMessage({
		"message": "showOccurrences",
		"occurrences": occurrences
	});
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if ("returnOptions" == request.message) {
		if ("undefined" != typeof request.keywords && request.keywords) {
			keywordsHighlighter(request.remove);
		}
	}
});

chrome.runtime.sendMessage({
	"message": "getOptions",
	"remove": false
});
