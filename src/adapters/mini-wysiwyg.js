// --buddyfile: ../scss/adapters/_wysiwyg.scss
/*
 * @Author: gilles
 * @Date:   2017-03-22 18:49:09
 * @Last Modified by:   gilles
 * @Last Modified time: 2017-03-27 17:17:29
 */

import uikitLexicon from '../uikit-lexicon';
import plateform from 'nomocas-webutils/lib/plateform';
import { insertHTML } from 'nomocas-webutils/lib/dom-utils';
import Wysiwyg from 'mini-wysiwyg';

export default uikitLexicon.addCompounds(() => {
	return {
		wysiwyg(value, editMode, placeholder, onUpdate) {
			if (plateform.isServer)
				return this.onString((descriptor) => {
					descriptor.children = value;
				});

			return this.prop('contentEditable', !!editMode)
				.onDom((node) => {
					const wysiwyg = node.wysiwyg = new Wysiwyg(node);
					wysiwyg.on('update', (e) => {
						onUpdate(e.detail.value);
					});
					wysiwyg._value = insertHTML(value, node);
					wysiwyg.clean();
				}, (node) => {
					node.innerHTML = '';
					if (value) {
						node.wysiwyg._value = insertHTML(value, node);
						node.wysiwyg.clean();
					}
				});
		},
		wysiwygMenu(helpers) {
			return this.onDom((node) => {
				const menu = Wysiwyg.menu();
				node.appendChild(menu.el);
				if (helpers) {
					helpers.hideWysiwygMenu = function() {
						menu.hide();
					};
					helpers.showWysiwygMenu = function() {
						menu.show();
					};
				}
			});
		}
	};
});

