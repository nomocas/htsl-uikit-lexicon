/*
 * @Author: gilles
 * @Date:   2017-03-22 18:48:00
 * @Last Modified by:   Gilles Coomans
 * @Last Modified time: 2017-04-26 13:12:15
 */
/* global $ */

import fitVids from 'nomocas-webutils/lib/fitvids';
const embed = require('clean-embed-video');

export default () => {
	return {
		fitVids(options) {
			return this
				.onDom((node) => {
					setTimeout(() => {
						fitVids($(node), $, options);
					}, 100);
				});
		},
		fittedVideo(url, options) {
			return this.html(embed(url)).fitVids(options);
		}
	};
};

