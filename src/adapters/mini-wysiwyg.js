// --buddyfile: ../scss/adapters/_wysiwyg.scss
/*
 * @Author: gilles
 * @Date:   2017-03-22 18:49:09
 * @Last Modified by:   Gilles Coomans
 * @Last Modified time: 2017-07-08 14:03:51
 */

import plateform from 'nomocas-webutils/lib/plateform';
import domUtils from 'nomocas-webutils/lib/dom-utils';
import Wysiwyg from 'mini-wysiwyg/index';

export default () => {
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
					domUtils.insertHTML(value, node);
					wysiwyg._value = node.innerHTML;
					wysiwyg.clean();
					node.addEventListener('paste', () => setTimeout(() => wysiwyg.clean()));
				}, (node) => {
					node.innerHTML = '';
					if (value) {
						domUtils.insertHTML(value, node);
						node.wysiwyg._value = node.innerHTML;
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
};

