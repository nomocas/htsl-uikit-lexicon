/*
 * @Author: gilles coomans
 */

/* eslint no-console:0 */

// import Component from 'htsl-component';
import posterLexicon from './poster-lexicon';
import mutate from 'mutater';

/**
 * State should hold :
 * {
 * 		editMode: true|false
 * 		poster: Object
 * 		loading: true|false
 * 		posterposterError: String|null
 * }
 */

// const Poster = Component.extends(Component, {
const mixin = {
	// getInitialState(props) {
	// 	return Object.assign({}, props);
	// },
	// componentWillReceiveProps(props) {
	// 	this.state = Object.assign({}, props);
	// },
	/**
	 ******************* ITEMS MODEL
	 */

	deletePosterItem(index, save = true) {
		this.setState(mutate(this.state).from('poster', mutate.splice('content', index, 1)).val());
		if (save)
			this.state.client.deleteItem(this.state.poster.id, index)
			.then(() => this.setState({ posterError: null }))
			.catch((e) => this.setState({ posterError: e.message }));
	},
	insertPosterItemAt(item, index, save = true) {
		this.setState(mutate(this.state).from('poster', mutate.splice('content', index, 0, item)).val());
		if (save)
			this.state.client.insertItemAt(this.state.poster.id, item, index)
			.then(() => this.setState({ posterError: null }))
			.catch((e) => this.setState({ posterError: e.message }));
	},
	pushPosterItem(item, save = true) {
		this.setState(mutate(this.state).from('poster', mutate.push('content', item)).val());
		if (save)
			this.state.client.pushItem(this.state.poster.id, item)
			.then(() => this.setState({ posterError: null }))
			.catch((e) => this.setState({ posterError: e.message }));
	},
	updatePosterItemProperty(index, propertyName, value, save = true) {
		this.setState(mutate(this.state).from('poster.content.' + index, mutate.set(propertyName, value)).val());
		if (save)
			this.state.client.updateItemProperty(this.state.poster.id, index, propertyName, value)
			.then(() => this.setState({ posterError: null }))
			.catch((e) => this.setState({ posterError: e.message }));
	},
	deletePosterItemProperty(index, propertyName, save = true) {
		this.setState(mutate(this.state).from('poster.content.' + index, mutate.delete(propertyName)).val());
		if (save)
			this.state.client.deleteItemProperty(this.state.poster.id, index, propertyName)
			.then(() => this.setState({ posterError: null }))
			.catch((e) => this.setState({ posterError: e.message }));
	},
	updatePosterItem(index, data, save = true) {
		this.setState(mutate(this.state).from('poster.content', mutate.merge(index, data)).val());
		if (save)
			this.state.client.updateItem(this.state.poster.id, data, index)
			.then(() => this.setState({ posterError: null }))
			.catch((e) => this.setState({ posterError: e.message }));
	},
	displacePosterItem(fromIndex, toIndex, save = true) {
		const child = this.state.poster.content[fromIndex];
		if (!child)
			throw new Error('Poster : Could not displaceItem : nothing found with : ' + fromIndex);
		const items = this.state.poster.content.slice();
		items[fromIndex] = items[toIndex];
		items[toIndex] = child;
		if (save)
			this.setState(mutate(this.state).merge('poster', { content: items }).val());
		this.state.client.displaceItem(this.state.poster.id, fromIndex, toIndex)
			.then(() => this.setState({ posterError: null }))
			.catch((e) => this.setState({ posterError: e.message }));
	},
	/**
	 ******************** UPLOAD IMAGE 
	 */
	uploadPosterImage(index, form) {
		this.updatePosterItem(index, { saving: true, posterError: null }, false);
		return this.state.client.uploadImage(this.state.poster.id, index, form)
			.logError('poster image upload failed')
			.then((photo) => {
				delete this.state.poster.content[index].saving;
				delete this.state.poster.content[index].error;
				this.updatePosterItem(index, {
					uri: photo.versions.big,
					descriptor: photo
				});
			})
			.catch((e) => this.setState(mutate(this.state).from('poster.content.' + index, mutate.delete('saving').set('error', e.message)).val()));
	},
	/**
	 ******************** ITEMS UI ACTIONS
	 */
	addPosterItem(e, data) {
		// hide menu
		if (this.menuInserted) {
			this.menu.$remove(this.posterMenuElement.parentNode);
			this.menuInserted = false;
		}
		// apply insertion
		if (typeof this.insertPosterItemToIndex !== 'undefined')
			this.insertPosterItemAt(data, this.insertPosterItemToIndex);
		else
			this.pushPosterItem(data);
	},
	posterItemGoesUp(e, index) {
		if (index === 0)
			return;
		this.displacePosterItem(index, index - 1);
	},
	posterItemGoesDown(e, index) {
		if (index >= (this.state.poster.content.length - 1))
			return;
		this.displacePosterItem(index, index + 1);
	},

	/**
	 ********************* MENU HANDLING
	 */

	insertPosterMenu(nextSibling, index) {
		if (!this.menu)
			this.menu = this.createPosterMenu();
		this.insertPosterItemToIndex = index;
		if (this.menuInserted)
			this.menu.$remove(this.posterMenuElement.parentNode);
		this.menuInserted = true;
		this.menu.$renderBefore(nextSibling);
	},

	createPosterMenu() {
		const h = posterLexicon.initializer(true);
		return h.posterMenu(this);
	}
	/**
	 ************* RENDERING
	 */

	// render(firstLevel) {
	// 	const h = posterLexicon.initializer(firstLevel);
	// 	return h.poster(this.state, this);
	// }
// });
};

export default mixin;

