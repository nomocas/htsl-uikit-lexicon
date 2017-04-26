/* global ga */
import uikitLexicon from '../uikit-lexicon';
const gaStart = "<script>" +
	"(function(b, o, i, l, e, r) {" +
	"    b.GoogleAnalyticsObject = l;" +
	"    b[l] || (b[l] =" +
	"        function() {" +
	"            (b[l].q = b[l].q || []).push(arguments)" +
	"        });" +
	"    b[l].l = +new Date;" +
	"    e = o.createElement(i);" +
	"    r = o.getElementsByTagName(i)[0];" +
	"    e.src = '//www.google-analytics.com/analytics.js';" +
	"    r.parentNode.insertBefore(e, r)" +
	"}(window, document, 'script', 'ga'));" +
	"ga('create', '",
	gaEnd = "', 'auto'); ga('send', 'pageview'); </script>";

function gaEvent(category, type, data) {
	if (typeof ga !== 'undefined')
		ga('send', 'event', category, type, data);
}

uikitLexicon.addCompounds(() => {
	return {
		gascript(key) {
			return this.raw(gaStart + key + gaEnd);
		}
	};
});

export {
	gaEvent
};

