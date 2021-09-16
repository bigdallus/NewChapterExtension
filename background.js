const whitelist = {};

// get the domain in the url.
const urlRegex = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/i;
const blackListUrls = ["chrome"];

function Initialise() 
{
	// Get chrome whitelist
	chrome.storage.sync.get('whitelist', (data) =>
	{
		Object.assign(whitelist, data.whitelist);
	});
	if (whitelist.list === undefined)
	{
		whitelist.list = [];
	}
}

chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === "popup")
  {
	port.onMessage.addListener(function(msg) 
	{
	  if (msg.whitelist === 'add-whitelist') 
	  {	
  	    WhiteListCurrentTab(port);
	  }
	  else if (msg.whitelist === 'remove-whitelist')
	  {
	    UnWhiteListCurrentTab(port);
      } 
	  else if (msg.whitelist === 'queryCurrentPage-whitelist')
	  {
		  
	  }
	});
  }
  else if (port.name === "options")
  {
	port.onMessage.addListener(function(msg) 
	{
	  if (msg.whitelist === 'get-whitelist')
	  {
		GetWhiteList(port);
	  }
	  else if (msg.whitelistRemove != undefined)
	  {
		RemoveFromWhiteList(msg.whitelistRemove);
	  }
	});
  }
  else if (port.name === "keyevent")
  {
	port.onMessage.addListener(function(msg) 
	{
		if (msg.whitelist === 'get-whitelist')
		{
		  GetWhiteList(port);
		}
	});	
  }
});

Initialise();

function WhiteListCurrentTab(port)
{
	chrome.tabs.query({lastFocusedWindow: true, active: true}, function(tabs) {
		var domain = tabs[0].url.match(urlRegex)[1];
		console.log(domain);
		AddToWhiteList(domain);
		chrome.tabs.reload(tabs[0].id);
		port.postMessage({whitelistText: whitelist.list});
	});	
}

function AddToWhiteList(url)
{
	if (blackListUrls.indexOf(url) == -1)
	{
		if (whitelist.list.indexOf(url) == -1)
		{
			whitelist.list.push(url);
		}
	}
	chrome.storage.sync.set({whitelist});
}

function UnWhiteListCurrentTab(port)
{
	chrome.tabs.query({lastFocusedWindow: true, active: true}, function(tabs) {
		var domain = tabs[0].url.match(urlRegex)[1];
		console.log(domain);
		RemoveFromWhiteList(domain);
		chrome.tabs.reload(tabs[0].id);
		port.postMessage({whitelistText: whitelist.list});
	});	
}

function RemoveFromWhiteList(url)
{
	const index = whitelist.list.indexOf(url);
	if (index > -1)
	{
		whitelist.list.splice(index, 1);
	}
	chrome.storage.sync.set({whitelist});
}

function QueryWhiteListCurrentUrl(port)
{
	chrome.tabs.query({lastFocusedWindow: true, active: true}, function(tabs) {
		var domain = tabs[0].url.match(urlRegex)[1];
		port.postMessage({whitelistCurrentUrl: whitelist.list.indexOf(domain) != null});
	});
}

function GetWhiteList(port)
{
	port.postMessage({whitelistText: whitelist.list});
}