import type { HighlightableMap } from 'highlightable-map';
import 'highlightable-map/dist/HighlightableMapBundled.min.js';
import { customElement } from 'lit/decorators.js';
import { autorun } from 'mobx';
import { StateProvider } from './StateProvider';
import { html } from 'lit';
import './BeMapCountryDropdown';
import { nameToThreeAlphas } from '../data/countryNameTo3Alpha';

const HIGHLIGHT_COLORS: Record<number, string> = {
	5: '#002F6C',
	4: '#516692',
	3: '#6B83AE',
	2: '#8BA3CB',
	1: '#AEC7EB',
	0: '#CFCDC9',
	'-1': '#651D32'
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
			this.state.setCountry(e.detail.feature.properties.ADM0_A3_US);
		});

		this.highlightableMap.addEventListener(
			'hm-rendered',
			() => {
				this.disposers.push(
					// autorun(() => this.state.filteredCountries),
					autorun(() => {
						const toHighlight: string[] = [];
						Object.entries(this.state.totalYearlyDisbursements).forEach(
							([country, yearlyAmts]) => {
								if (!nameToThreeAlphas.has(country)) {
									return;
								}

								const amt = yearlyAmts[this.state.overviewFiscalYear];
								const countryCode = nameToThreeAlphas.get(country)!;
								const el = this.highlightableMap.countryEls.get(countryCode);

								if (!this.state.filteredCountries.includes(countryCode)) {
									el?.style.setProperty('fill', HIGHLIGHT_COLORS[0]);
								} else {
									let fill: string;

									if (amt < 0) {
										fill = 'pink';
										// fill = HIGHLIGHT_COLORS[-1];
									} else if (amt === 0) {
										fill = HIGHLIGHT_COLORS[0];
									} else if (amt < 1e6) {
										fill = HIGHLIGHT_COLORS[2];
									} else if (amt < 1e7) {
										fill = HIGHLIGHT_COLORS[3];
									} else if (amt < 1e8) {
										fill = HIGHLIGHT_COLORS[4];
									} else if (amt < 1e9) {
										fill = HIGHLIGHT_COLORS[5];
									} else {
										fill = 'hotpink';
									}

									el?.style.setProperty('fill', fill);
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
		return html`${this.hm}`;
	}

	get hm() {
		this.highlightableMap.selected = [this.state.selectedCountry];
		return this.highlightableMap;
	}
}
