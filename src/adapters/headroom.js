// --buddyfile: ../scss/adapters/_headroom.scss
/*
 * @Author: gilles
 * @Date:   2017-03-22 18:46:49
 * @Last Modified by:   Gilles Coomans
 * @Last Modified time: 2017-07-08 12:32:53
 */

// npm i --save headroom.js

import plateform from 'nomocas-webutils/lib/plateform';

let Headroom;
if (plateform.isBrowser)
	Headroom = require('headroom.js/dist/headroom');

export default (h) => {
	return {
		headroom(opt, containerScroller, content) {
			let headroom;
			return this.header(
				h.cl('headroom') // class for behaviour (headroom mecanism)
				.cl('headroom-header') // class for styling
				.onDom(
					// render
					node => {
						headroom = new Headroom(node, opt || {
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
					},
					null, // dif
					// remove
					() => headroom.destroy()
				),
				content || 'header content'
			);
		}
	};
};

