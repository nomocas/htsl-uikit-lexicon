/*
 * @Author: Gilles Coomans
 */

'use strict';

export default (h) => {
	return {
		spinner() {
			return this.div(
				h.class('spinner')
				.div(h.class('double-bounce1'))
				.div(h.class('double-bounce2'))
			);
		}
	};
};

