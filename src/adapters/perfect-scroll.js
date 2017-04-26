import uikitLexicon from '../uikit-lexicon';
import plateform from 'nomocas-webutils/lib/plateform';
//______________________________________ PERFECT SCROLL BAR
let Ps;
if (plateform.isBrowser)
	Ps = require('perfect-scrollbar');

export default uikitLexicon.addCompounds(() => {
	return {
		perfectScroll() {
			if (plateform.isBrowser && !plateform.isMacLike && !plateform.isMobile)
				return this.onDom((context, node) => {
					Ps.initialize(node);
				});
			return this;
		}
	};
});

