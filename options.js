var backgroundPort = chrome.runtime.connect({name: "options"});

function Initialise()
{
	backgroundPort.postMessage({whitelist: 'get-whitelist'});
}

backgroundPort.onMessage.addListener(function(msg) {
	document.getElementById("listOfUrls").innerHTML = "";
	
	msg.whitelistText.forEach(element => {		
		var divider = document.createElement('div');
		var text = document.createTextNode(element);
		divider.appendChild(text);
		var deleteButton = document.createElement('button')
		deleteButton.type = 'button';
		deleteButton.innerHTML = 'x';
		deleteButton.url = element; 
		deleteButton.addEventListener("click", RemoveFromWhiteList, false);
		divider.appendChild(deleteButton);
		document.getElementById("listOfUrls").appendChild(divider);
	});	
});

window.onfocus = function() { backgroundPort.postMessage({whitelist: 'get-whitelist'}); };

Initialise();

function RemoveFromWhiteList(evt)
{
	backgroundPort.postMessage({whitelistRemove: evt.currentTarget.url});
}