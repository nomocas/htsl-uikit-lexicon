// --buddyfile: ../scss/views/_poster.scss
/*
 * @Author: gilles coomans
 */

/* global $ */

import uikitLexicon from '../uikit-lexicon';
import fitVids from 'nomocas-webutils/lib/fitvids';
import embed from 'clean-embed-video/index';
import '../adapters/mini-wysiwyg';

// const validUri = /^(http(?:s)?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/,
const posterLexicon = uikitLexicon.createDialect('poster');

export default posterLexicon.addCompounds((h) => {
	return {
		// ______________________________ main poster function
		poster(state, ctrl) {
			const lastIndex = state.poster.content.length - 1;
			return this.div(
				h.class('poster-items')
				.ref('itemsContainer')
				.if(state.error, h.closableCallout('alert', 'error : ' + state.error))
				.if(state.loading,
					h.spinner(),
					// else
					h.each(state.poster.content, (item, index) => h.posterItem(item, index, lastIndex, state.editMode, state.allowAddition, ctrl))
					.client(h.if(state.allowAddition && state.editMode, h.posterEndMenuButton(ctrl)))
				)
			);
		},
		//__________________________________________________ POSTER ITEM WRAPPER
		posterItem(item, index, lastIndex, editMode, allowAddition, ctrl) {
			return this
				.if(allowAddition, h.posterInterItemButton(editMode, index, ctrl))
				.div(
					h.class('poster-item')
					.class('edited-mode', editMode)
					.switchUse(item.layout, item, index, lastIndex, editMode, ctrl)
				);
		},
		//________________________________ MENU "PLUS" BUTTON
		posterEndMenuButton(ctrl) {
			return this.div(
				h.class('poster-end-menu-button')
				.posterPlusButton(ctrl)
			);
		},
		posterInterItemButton(editMode, index, ctrl) {
			return this.div(
				h.class('poster-inter-button')
				.class('edited-mode', editMode)
				.if(editMode, h.posterPlusButton(ctrl, index))
			);
		},
		posterPlusButton(ctrl, index) {
			return h.button(
				h.classes('icon-button plus-button')
				.icon('plus')
				.click((e) => ctrl.insertPosterMenu(index !== undefined ? e.currentTarget : e.currentTarget.parentNode, index))
			);
		},
		//__________________________________________________ POSTER ITEM MENU
		posterItemMenu(lastIndex, index, editMode, ctrl, templ) {
			return this.if(editMode,
				h.div(
					h.class('poster-item-menu')
					.primaryButton(
						h.class('box-button')
						.icon('trash')
						.click(() => ctrl.deletePosterItem(index))
					)
					.if(index > 0, h.button(h.class('box-button').icon('arrow-up').click(ctrl.posterItemGoesUp, index)))
					.if(index < lastIndex, h.button(h.class('box-button').icon('arrow-down').click(ctrl.posterItemGoesDown, index))),
					templ
				)
			);
		},
		/*******************************************************************************
		 *
		 * MENU
		 *
		 *******************************************************************************/
		posterMenu(ctrl) {
			return this.div(
				h.class('poster-menu-panel')
				.onDom(($tag) => ctrl.posterMenuElement = $tag)
				.posterMenuButtons(ctrl)
			);
		},
		posterMenuButtons(ctrl) {
			return this
				// .posterMenuButton(ctrl, h.text('h').tag('sup', [1]), {
				// 	layout: 'poster:posterH1',
				// 	content: 'First Level Title'
				// })
				.posterMenuButton(ctrl, h.text('h').tag('sup', [2]), {
					layout: 'poster:posterH2',
					content: 'Second Level Title'
				})
				.posterMenuButton(ctrl, h.icon('quote-right'), {
					layout: 'poster:posterHeadline',
					content: 'A cool headline...'
				})
				.posterMenuButton(ctrl, h.icon('align-justify'), {
					layout: 'poster:posterText',
					content: 'Some text...'
				})
				.posterMenuButton(ctrl, h.icon('picture-o'), {
					layout: 'poster:posterImage',
					uri: '/statics/img/default-image.gif'
				})
				.posterMenuButton(ctrl, h.icon('video-camera'), {
					layout: 'poster:posterVideo',
					uri: ''
				});
		},
		posterMenuButton(ctrl, templ, data) {
			return h.button(h.class('box-button').click(ctrl.addPosterItem, data), templ);
		},
		/*******************************************************************************
		 *
		 * ITEMS
		 *
		 *******************************************************************************/
		posterH1(item, index, lastIndex, editMode, ctrl) {
			// console.log('poster edit flag : ', editMode);
			return this
				.posterItemMenu(lastIndex, index, editMode, ctrl)
				.h1(h.contentEditable({
					value: item.content,
					isEditable: editMode,
					placeholder: 'Level 1 Header...',
					updateOnEvent: 'blur',
					updateHandler: (value) => ctrl.updatePosterItemProperty(index, 'content', value)
				}));
		},
		posterH2(item, index, lastIndex, editMode, ctrl) {
			return this
				.posterItemMenu(lastIndex, index, editMode, ctrl)
				.h2(h.contentEditable({
					value: item.content,
					isEditable: editMode,
					placeholder: 'Level 2 Header...',
					updateOnEvent: 'blur',
					updateHandler: (value) => ctrl.updatePosterItemProperty(index, 'content', value)
				}));
		},
		posterHeadline(item, index, lastIndex, editMode, ctrl) {
			return this
				.posterItemMenu(lastIndex, index, editMode, ctrl)
				.div(
					h.class('poster-headline')
					.class('empty-value', !item.content)
					.contentEditable({
						value: item.content,
						isEditable: editMode,
						placeholder: 'headline...',
						updateOnEvent: 'blur',
						updateHandler: (value) => ctrl.updatePosterItemProperty(index, 'content', value)
					})
				);
		},
		posterText(item, index, lastIndex, editMode, ctrl) {
			return this
				.posterItemMenu(lastIndex, index, editMode, ctrl)
				.div(
					h.class('poster-text')
					.wysiwyg(item.content, editMode, 'some text...', (value) => ctrl.updatePosterItemProperty(index, 'content', value))
				);
		},
		posterImage(image, index, lastIndex, editMode, ctrl) {
			// let form;
			return this
				.posterItemMenu(lastIndex, index, editMode, ctrl, h.imageUploadButton(index, ctrl))
				.div(
					h.class('poster-image')
					.if(image.saving,
						h.spinner(),
						// else
						h.if(image.error,
							h.callout('alert', image.error),
							// else
							h.if(image.uri,
								h.img(image.uri)
								.div(
									h.class('poster-image-infos')
									.display(editMode || image.copyright)
									.label('copyright')
									.span(image.copyright, h.contentEditable({
										value: image.copyright,
										isEditable: editMode,
										placeholder: 'image copyright',
										updateOnEvent: 'blur',
										updateHandler: (value) => ctrl.updatePosterItem(index, { copyright: value })
									}))
								),
								// else
								h.div('poster-image-missing', 'Missing image. Please upload one.')
							)
						)
					)
				);
		},
		posterVideo(item, index, lastIndex, editMode, ctrl) {
			// http://www.tutorialspark.com/html5/HTML5_Youtube_Vimeo_DailyMotion_Embed.php
			// // https://codetuts.tech/responsive-videos-javascript-jquery/
			// https://www.npmjs.com/package/embed-video
			const options = {};
			return this
				.posterItemMenu(lastIndex, index, editMode, ctrl)
				.div(
					h
					.class('poster-video')
					.if(item.uri && !item.badURI,
						h.div(h.fittedVideo(item.uri, options, (data) => ctrl.updatePosterItem(index, data)))
					)
					.if(item.badURI, h.closableCallout('alert', 'bad video url'))
					.if(!item.uri || item.badURI,
						h.input('text', '',
							h.attr('placeholder', 'paste video url here')
							.display(editMode)
							.on('input', (e) => {
								// if (e.target.value && validUri.test(e.target.value))
								// 	ctrl.updatePosterItem(index, { badURI: true });
								// else
								ctrl.updatePosterItem(index, {
									badURI: false,
									uri: e.target.value
								});
							})
						)
					)
				);
		},
		fittedVideo(uri, options = null, updateItemHandler = null) {
			const output = uri ? embed(uri, options) : false;
			if (output) {
				const handler = ($tag) => setTimeout(() => { fitVids($($tag), $, options); }, 200);
				return h.html(output.videoHTML)
					.onDom(handler, handler);
			} else {
				uri && updateItemHandler && updateItemHandler({ badURI: true });
				return this.html('');
			}
		},
		/**
		 * EXTERNAL
		 */
		imageUploadButton(index, ctrl) {
			return h.form(
					h.class('show-for-sr')
					.attr('enctype', 'multipart/form-data')
					.attr('action', 'post')
					.input('file', '',
						h.display(false)
						.attr('name', 'photo')
						.on('change', (e) => {
							const fileInput = e.currentTarget,
								form = fileInput.parentNode;
							if (fileInput.files && fileInput.files[0])
								ctrl.uploadPosterImage(index, form)
								.then(() => {
									form.reset();
								});
						})
					)
				)
				.iconButton('image', h.classes('box-button').click((e) => {
					e.currentTarget.previousSibling[0].click();
				}));
		},
		closableCallout(type, message) {
			return this.container((ctrl) => h.div(type, ' - ', message, h.click(ctrl.unmount)));
		},
		callout(type, message) {
			return this.div(type, ' - ', message);
		},
		primaryButton(text, templ) {
			return this.button(h.class('primary'), text, templ);
		},
		fileUploadButton(id, text, callback) {
			return this.span(
				h
				.class('poster-image-upload-button')
				.label(
					h.class('button')
					.attr('for', id),
					text
				)
				.input('file', '',
					h.display(false)
					.attr('name', 'photo')
					.id(id)
					.on('change', callback)
				)
			);
		},
		spinner() {
			return this.div('spinner');
		},
		iconButton(icon, content) {
			return this.button(h.class('icon-button').faicon(icon), content);
		},
		faicon(type, templ) {
			return this.i(h.class('fa').class('fa-' + type), templ);
		}
	};
});

