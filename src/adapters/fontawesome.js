/*
 * @Author: gilles
 * @Date:   2017-03-22 18:46:31
 * @Last Modified by:   Gilles Coomans
 * @Last Modified time: 2017-04-26 12:26:59
 */


export default (h) => {
	return {
		fontawesomeLink() {
			return this.linkCSS('https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css');
		},
		faicon(type, templ) {
			return this.i(h.cl('fa').cl('fa-' + type), templ);
		}
	};
};

