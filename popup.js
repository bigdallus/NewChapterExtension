// Add any listeners 
document.getElementById("add_whitelist_button").addEventListener("click", AddToWhiteList);
document.getElementById("remove_whitelist_button").addEventListener("click", RemoveFromWhiteList);

var backgroundPort = chrome.runtime.connect({name: "popup"});

function AddToWhiteList ()
{	
	backgroundPort.postMessage({whitelist: 'add-whitelist'});
}

function RemoveFromWhiteList()
{
	backgroundPort.postMessage({whitelist: 'remove-whitelist'});
}

backgroundPort.onMessage.addListener(function(msg) {
	document.getElementById("test-text").innerHTML = msg.whitelistText;
});