/*
 * @Author: Gilles Coomans
 * @Date:   2017-07-08 12:14:31
 * @Last Modified by:   Gilles Coomans
 * @Last Modified time: 2017-07-08 12:16:54
 */
/* global $ */

'use strict';

import fitVids from 'nomocas-webutils/lib/fitvids';
import embed from 'clean-embed-video';

export default () => {
	return {
		fittedVideo(uri, options = null, updateItemHandler = null) {
			const output = uri ? embed(uri, options) : false;
			if (output) {
				const handler = ($tag) => setTimeout(() => { fitVids($($tag), $, options); }, 200);
				return this.html(output.videoHTML)
					.onDom(handler, handler);
			} else {
				uri && updateItemHandler && updateItemHandler({ badURI: true });
				return this.html('');
			}
		}
	};
};

