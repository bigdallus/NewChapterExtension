var next_char = '0'
const lastNumberRegex = new RegExp('\\d+', 'g');
const chapterRegex = new RegExp('[\\w\\d-]+', 'g');
const urlRegex = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/i;

var whitelist = {};
var backgroundPort = chrome.runtime.connect({name: "keyevent"});

document.onkeypress = function(evt) {
	var domain = window.location.href.match(urlRegex)[1]
	if (whitelist.list.indexOf(domain) != -1)
	{
      evt = evt || window.event;	
      var charCode = evt.keyCode || evt.which;
      var charStr = String.fromCharCode(charCode);
		if (charStr === next_char)
		{
			var currentUrl = window.location.href.toString()		
			var listOfWordMatches = Array.from(chapterRegex[Symbol.matchAll](currentUrl), x=> x[0]);
			if (listOfWordMatches != null)
			{
				var wordThatMatches = listOfWordMatches.pop();
				var listOfMatches = Array.from(lastNumberRegex[Symbol.matchAll](wordThatMatches), x=> x[0]);
				if (listOfMatches != null)
				{
					var currentChapter = parseInt(listOfMatches.pop());
					var nextChapter = currentChapter+1;
					var wordReplaced = wordThatMatches.replace(currentChapter.toString(), nextChapter.toString())
					var nextUrl = currentUrl.replace(wordThatMatches, wordReplaced);
					window.location.href = nextUrl;
				}
			}
		}
	}
};

window.onfocus = Focused;

function Focused()
{
	chrome.storage.local.get('whitelist', (data) =>
	{
		Object.assign(whitelist, data.whitelist);
	});
}

backgroundPort.onMessage.addListener(function(msg) {
	whitelist = msg.whitelistText;
});

Focused();