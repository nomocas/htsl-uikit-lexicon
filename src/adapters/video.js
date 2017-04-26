/*
 * @Author: gilles
 * @Date:   2017-03-22 18:48:00
 * @Last Modified by:   Gilles Coomans
 * @Last Modified time: 2017-04-26 12:24:49
 */
/* global $ */

import fitVids from 'nomocas-webutils/lib/fitvids';
import embed from 'clean-embed-video';

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

