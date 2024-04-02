import { HighlightableMap } from 'highlightable-map';
import { customElement } from 'lit/decorators.js';

@customElement('highlightable-map')
export class BeHighlightableMap extends HighlightableMap {
	constructor() {
		super();

		Promise.all([
			import('highlightable-map/src/geoJson.json'),
			import('leaflet/dist/leaflet.css?inline')
		]).then(([{ default: geoJson }, { default: css }]) => {
			this.setGeoJson(geoJson);
			const stylesheet = new CSSStyleSheet();
			stylesheet.replaceSync(css);
			this.setCss(stylesheet);
		});
	}
}
