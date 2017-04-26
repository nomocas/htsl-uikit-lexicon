/*
 * @Author: gilles
 * @Date:   2017-03-22 18:46:31
 * @Last Modified by:   gilles
 * @Last Modified time: 2017-03-27 17:11:14
 */

import uikitLexicon from '../uikit-lexicon';

export default uikitLexicon.addCompounds((h) => {
	return {
		fontawesomeLink() {
			return this.linkCSS('https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css');
		},
		faicon(type, templ) {
			return this.i(h.cl('fa').cl('fa-' + type), templ);
		}
	};
});

