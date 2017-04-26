/*
 * @Author: Gilles Coomans
 */

import babelute from 'babelute';
import htmlLexicon from 'htsl-lexicon';

export default babelute.createLexicon('uikit', htmlLexicon)
	.addCompounds((h) => {
		return {
			icon(type, templ) {
				return this.i(h.class('fa').class('fa-' + type), templ);
			},

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
			},

			primaryButton(title, templ) {
				return this.button(title, templ);
			}
		};
	});

