chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if ("getOptions" == request.message) {
		if ("undefined" != typeof localStorage) {
			chrome.tabs.query({
					"active": true,
					"currentWindow": true
				},
				function(tabs) {
					if ("undefined" != typeof tabs[0].id && tabs[0].id) {
						var showOccurrences = localStorage.getItem("showOccurrences");
						showOccurrences = "true" == showOccurrences || null == showOccurrences;
						var femalecolor = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
						var malecolor = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
						var genderunknown = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);

						chrome.tabs.sendMessage(tabs[0].id, {
							"message": "returnOptions",
							"remove": request.remove,
							"femalecolor": femalecolor,
							"malecolor": malecolor,
							"genderunknown": genderunknown,
						});
					}
				}
			);
		}
	}
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if ("showOccurrences" == request.message) {
		var showOccurrences = localStorage.getItem("showOccurrences");
		showOccurrences = "true" == showOccurrences || null == showOccurrences;

		chrome.browserAction.setBadgeText({
			"text": showOccurrences && request.occurrences ? String(request.occurrences) : "",
			"tabId": sender.tab.id
		});
	}
});
