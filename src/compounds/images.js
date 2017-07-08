/*
 * @Author: Gilles Coomans
 */

'use strict';

export default (h) => {
	return {
		background(url, backgroundSize = 'cover') {
			return this.style('background', 'url(' + url + ') no-repeat center center')
				.style('backgroundSize', backgroundSize);
		},

		thumbnail(src, alt, templ) {
			return this.img(src,
				h.class('thumbnail')
				.attr('alt', alt || 'image with no alternate text'),
				templ
			);
		},

		roundedThumbnail(src, alt, templ) {
			return this.img(src,
				h.classes('thumbnail rounded')
				.attr('alt', alt || 'image with no alternate text'),
				templ
			);
		}
	};
};