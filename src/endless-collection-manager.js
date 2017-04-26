/*
 * GridManager with htsl rendering
 *
 * @usage
 * var gridManager = new CollectionManager({
 * 	limit:20,
 * 	uri:'document::...',
 * 	itemsContainer:$elem,
 * 	scrollerContainer:$elem2,
 * 	loadPage: function(uri, limit, skip) {
 * 		return ctx.waiting(yam.c3po.get(uri + '&filter[limit]=' + limit + '&filter[skip]=' + skip));
 * 	},
 * 	renderItem:function(item){
 * 		return h.myComponenent(item);
 * 	}
 * });
 * gridManager.on('updated', ...)
 * gridManager.on('destroyed', ...)
 * gridManager.updateItem(object);
 * gridManager.deleteItem(id);
 * gridManager.reset(gridManager.uri);
 */

const ReachEndListener = require('nomocas-webutils/lib/reach-end-listener'),
	Emitter = require('nomocas-utils/lib/emitter'),
	objectUtils = require('nomocas-utils/lib/object-utils');

const bbl = require('htsl-bundled/dist/index.js'),
	babeluteDifEngine = bbl.differ;

function CollectionManager(opt) {
	this.pager = {
		limit: opt.limit || 20,
		skip: 0
	};
	this.pages = [];
	this.itemsContainer = opt.itemsContainer;
	this.scrollerContainer = opt.scrollerContainer || opt.itemsContainer;
	this.renderItem = opt.renderItem;
	this.loadPage = opt.loadPage;
	this.ctx = opt.ctx;

	const gridManager = this;
	this.reachEndListener = new ReachEndListener({
		scrollerElement: this.scrollerContainer,
		delayBeforeReact: 300
	});
	this.reachEndListener.on('reachEnd', () => {
		gridManager.loadNextPage();
	});

	if (opt.domInit)
		opt.domInit(this);

	this.reset(opt.uri);
}

CollectionManager.prototype = new Emitter();

const proto = {
	renderItem(/*item*/) {
		// will be overrided
	},
	loadPage(/*uri, limit, skip*/) {
		// will be overriden
	},
	loadNextPage() {
		const self = this;
		this.pager.skip += this.pager.limit;
		this.loadPage(this.uri, this.pager.limit, this.pager.skip)
			.then((results) => {
				if (!results.length) {
					// console.log('GridManager : next page is empty', results);
					self.pager.skip -= self.pager.limit;
				} else
					self.appendPage(results);
			});
	},
	reset(newURI) {
		const self = this;
		this.pager.skip = 0;
		this.uri = newURI || this.uri;
		this.loadPage(this.uri, this.pager.limit, this.pager.skip)
			.then((results) => {
				if (!results.length) {
					self.pager.skip -= self.pager.limit;
					self.removePages();
					self.emit('updated');
				} else {
					if (self.pages.length) {
						self.removePages(true);
						self.updatePage(0, results);
					} else
						self.appendPage(results);
				}
			});
	},
	updateItem(item) {
		const updated = this.pages.some((page) => {
			if (page.hasItem(item.id)) {
				page.updateItem(item);
				return true;
			}
		});
		if (updated)
			this.emit('updated');
	},
	deleteItem(itemId) {
		const updated = this.pages.some((page) => {
			if (page.hasItem(itemId)) {
				page.deleteItem(itemId);
				return true;
			}
		});
		if (updated)
			this.emit('updated');
	},
	removePages(keepFirst) {
		const self = this;
		let first;
		if (keepFirst)
			first = this.pages.shift();
		this.pages.forEach((page) => {
			page.children.forEach((rendered) => {
				babeluteDifEngine.remove(self.itemsContainer, rendered);
			});
		});
		this.pages = first ? [first] : [];
	},
	updatePage(index, results) {
		const page = this.pages[index],
			oldChildren = page.children,
			olen = oldChildren.length,
			self = this;
		let childIndex = 0;

		page.keyMap = {};
		page.children = [];
		results.forEach((item) => {
			const rendered = self.renderItem(item);
			page.children.push(rendered);
			babeluteDifEngine.$output(self.itemsContainer, rendered, oldChildren[childIndex++]);
			page.keyMap[item.id] = rendered;
		});
		if (childIndex < olen)
			for (; childIndex < olen; childIndex++)
				babeluteDifEngine.remove(self.itemsContainer, oldChildren[childIndex++]);
		this.emit('updated');
	},
	appendPage(results) {
		const self = this,
			page = {
				keyMap: {},
				children: [],
				hasItem(itemId) {
					return !!this.keyMap[itemId];
				},
				updateItem(item) {
					item = objectUtils.copy(item);
					babeluteDifEngine.$output(self.itemsContainer, self.renderItem(item), this.keyMap[item.id]);
				},
				deleteItem(itemId) {
					const rendered = this.keyMap[itemId];
					this.children = this.children.filter((child) => {
						return child === rendered;
					});
					babeluteDifEngine.remove(self.itemsContainer, rendered);
					delete this.keyMap[itemId];
				}
			};
		this.pages.push(page);
		results.forEach((item, index) => {
			const rendered = self.renderItem(item, index);
			page.keyMap[item.id] = rendered;
			babeluteDifEngine.render(self.itemsContainer, rendered);
			page.children.push(rendered);
		});
		this.emit('updated');
	},
	destroy() {
		this.reachEndListener.destroy();
		this.emit('destroyed');
	}
};

CollectionManager.constructor = CollectionManager;

for (const i in proto)
	CollectionManager.prototype[i] = proto[i];

export default CollectionManager;

