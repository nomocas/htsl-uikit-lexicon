/*
 * @Author: gilles
 * @Date:   2017-03-22 18:48:00
 * @Last Modified by:   gilles
 * @Last Modified time: 2017-03-24 17:07:19
 */
/* global $ */

import uikitLexicon from '../uikit-lexicon';
import fitVids from 'nomocas-webutils/lib/fitvids';

const embed = require('../../vendor/embed-video.js');

uikitLexicon.addCompounds(() => {
	return {
		fitVids(options) {
			return this
				.dom((context, node) => {
					setTimeout(() => {
						fitVids($(node), $, options);
					}, 100);
				});
		},
		fittedVideo(url, options) {
			return this.html(embed(url)).fitVids(options);
		}
	};
});

