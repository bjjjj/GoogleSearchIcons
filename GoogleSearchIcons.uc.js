// ==UserScript==
// @name           GoogleSearchIcons.uc.js
// @note           20130614: modify by lastdream2013 for uAutoPagerize
// @note           20160428: fix # && webhp  by bj
// @include        main
// ==/UserScript==

(function () {
	var googleicon = function (aEvent) {
        doc =  aEvent.originalTarget;
		if (!doc || !doc.location) return;
		if (doc.location.href.match(/^https?:\/\/.*\.google\..*\/(search|\#|webhp)?.*$/i)) {

			// Check if already loaded  原来要注释掉了，为配合uAutoPagerize翻页
			//if(doc.getElementById("googleicon")) return;


			var results = doc.evaluate("//h3[contains(@class,'r')]/a", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			for (var i = results.snapshotLength - 1; i >= 0; i--) {
				var result = results.snapshotItem(i);

				if (result.firstChild.className == "googleicon") //Check if already loaded
					break;
				// Find url
				var url = result.href.replace(/<\S[^><]*>/g, "");
				if (/^http:\/\/.*\.google\..*\/url\?.*$/i.test(url))
					url = url.match(/&q=(.*?)&/)[1];
				var safe = (url.indexOf("https://") < 0);
				if (url.match("google.com/interstitial?"))
					url = "chrome://googleicon/content/malware.png";
				else
					url = "http://" + url.split('/')[2] + "/favicon.ico";

				// Add icon
				(function (url) {
					var img = new Image();
					img.width = 16;
					img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACG0lEQVQ4ja2TwW7aQBRF+ZDku0q/qChds5mxkDG2iY3H9jyTBFAWLAgRG7CwCawQi6BEQhgEFkiAuF3VaVXaSlWvdBazuGfx5r1c7n/H9/1rIvpCAUWS5E6S3FFAkU9+wff967+VP1FA6fPzMwaDAcbjMQaDAabTKSggEFEqpcxfLEvp5huNxnmxWGC73SIMQ9Tv6gjqAbrdLqT0Ub+rg4jOUro/S4QQV57nbZMkwel0wvF4xGazQafTgeu5GY1GA8PhEMITqRDiKhM4jnPTbrdxOBxwOByQJAlcz4UQ4heiKILruXAc52smsGzrpd/v4/X1FcPhEBQQ7Jp9kVarhdlsBsu2Xj4E1u3x/v4eRATLuv0tQT3AdDrFcrmEZd2eMoFZNXdm1cSP2DUbZtUEEYECglk1MRqNkKYp3t/fYZjGPhPohh7rhg7d0PH09IQ4jjGbzdBsNtHr9SBcAd3QMZlMMJ/PEYYhdEOPM0G5Ur7RKhoeHx+xWq2wXq+xXq/x9vaGVqsFraJBq2jQDT17l8vljyFyzq9UVd2qqoooirBarTLCMIRds6GqKgzTgOPUoKpqyjn/+MZcLpdTFCVfKpXOlm1huVwiSRIkSYLFYgGzauLh4QHNZhNaRTsrinJ5GxljeUVRUil99Ho9dLtduJ4LKX0QERRFSTnnny+Wv6dYLF4zxgqMsZhzvuec7xljMWOsUCwW/3xM/5JvTakQArDW8fcAAAAASUVORK5CYII=";
					img.className = "googleicon";
					img.setAttribute("style", "border:0; padding-top:2px; padding-right:4px; display:block; float:left;");
					result.insertBefore(img, result.firstChild);
					if (safe) {
						var newimg = new Image();
						newimg.src = url;
						newimg.addEventListener("load", function (doc) {
							if (!img) return;
							img.src = url;
						}, false);
					}
				})(url);
			}
			
			// Create Google Icon
			var div = doc.createElement("div");
			div.id = "googleicon";
			if(results.snapshotLength == 0){
                		setTimeout(function () {
                		googleicon(aEvent);
                		}, 100);
             		}else{
        			doc.body.appendChild(div);
             		}
		}
	};

	// Bind Google Icon
	var delay = function (aEvent) {
		setTimeout(function () {
			googleicon(aEvent);
		}, 1);
	};
	var load = function () {
		gBrowser.addEventListener("DOMContentLoaded", delay, true);
		gBrowser.addEventListener('GM_AutoPagerizeNextPageLoaded', delay, true);
	};
	window.addEventListener("pageshow", load, false);

})();
