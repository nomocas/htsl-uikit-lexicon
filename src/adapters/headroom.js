/*
 * @Author: gilles
 * @Date:   2017-03-22 18:46:49
 * @Last Modified by:   gilles
 * @Last Modified time: 2017-03-22 19:16:12
 */

import uikitLexicon from '../uikit-lexicon';
import plateform from 'nomocas-webutils/lib/plateform';

// --buddyfile: ../scss/adapters/_headroom.scss
// npm i --save headroom.js

let Headroom;
if (plateform.isBrowser)
	Headroom = require('headroom.js/dist/headroom');

export default uikitLexicon.addCompounds((h) => {
	return {
		headroom(opt, containerScroller, content) {
			return this.header(
				h.cl('headroom') // class for behaviour (headroom mecanism)
				.cl('headroom-header') // class for styling
				.onDom((node) => {
					const headroom = new Headroom(node, opt || {
						offset: 205,
						tolerance: 5,
						scroller: containerScroller || node.parentNode,
						classes: {
							initial: "animated",
							pinned: "slideDown",
							unpinned: "slideUp"
						}
					});
					headroom.init();
					// don't forget to
					// headroom.destroy();
				}),
				content || 'header content'
			);
		}
	};
});

