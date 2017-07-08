/*
 * @Author: Gilles Coomans
 * @Date:   2017-07-08 12:14:31
 * @Last Modified by:   Gilles Coomans
 * @Last Modified time: 2017-07-08 12:30:02
 */

function gaString(key) {
	return `
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', '${ key }', 'auto');
ga('send', 'pageview');
	`;
}

export default () => {
	return {
		gascript(key) {
			return this.scriptRaw(gaString(key));
		}
	};
};

