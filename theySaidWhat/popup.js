document.addEventListener("DOMContentLoaded", function() {
	loadOptions();
	console.log("load should have been called");

	// document.getElementById("buttonCancel").addEventListener("click", function() {
	// 	window.close();
	// });

	document.getElementById("buttonSave").addEventListener("click", function() {
		saveOptions();
		console.log("save should have been called");
		window.close();

		chrome.runtime.sendMessage({
			"message": "getOptions",
			"remove": true
		});
	});
});
