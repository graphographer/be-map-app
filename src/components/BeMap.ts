import type { HighlightableMap } from 'highlightable-map';
import 'highlightable-map/dist/HighlightableMapBundled.min.js';
import { customElement } from 'lit/decorators.js';
import { autorun } from 'mobx';
import { StateProvider } from './StateProvider';

const HIGHLIGHT_COLORS: Record<number, string> = {
	5: '#002F6C',
	4: '#516692',
	3: '#6B83AE',
	2: '#8BA3CB',
	1: '#AEC7EB',
	0: '#CFCDC9'
};

@customElement('be-map')
export class BeMap extends StateProvider {
	highlightableMap: HighlightableMap;

	constructor() {
		super();

		this.highlightableMap = document.createElement(
			'highlightable-map'
		) as HighlightableMap;
		this.highlightableMap.setAttribute('tooltip', '');
		this.highlightableMap.setAttribute('autozoom', '');
		this.highlightableMap.addEventListener('click-country', (e: any) => {
			this.state.setCountry(e.detail.feature.properties.SOVEREIGNT);
		});

		this.highlightableMap.addEventListener(
			'hm-rendered',
			() => {
				// this might not need to be an autorun, if there is no other state
				// that can change the highlighting after the initial render
				this.disposers.push(
					autorun(() => {
						const toHighlight: string[] = [];
						Object.entries(this.state.numberOfAgencies).forEach(
							([country, numberOfAgencies]) => {
								const el = this.highlightableMap.countryEls.get(country);

								el?.style.setProperty(
									'fill',
									HIGHLIGHT_COLORS[numberOfAgencies]
								);

								if (numberOfAgencies > 0) {
									toHighlight.push(country);
								}
							}
						);
						this.highlightableMap.highlight = toHighlight;
					})
				);
			},
			{ once: true }
		);

		this.state.highlightableMap = this.highlightableMap;
	}

	render() {
		return this.hm;
	}

	get hm() {
		this.highlightableMap.selected = [this.state.selectedCountry];
		return this.highlightableMap;
	}
}
