import type { HighlightableMap } from 'highlightable-map';
import 'highlightable-map/dist/HighlightableMapBundled.min.js';
import { Marker, icon, marker } from 'leaflet';
import { css, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { autorun, reaction } from 'mobx';
import bluePin from '../images/blue_pin.png';
import redPin from '../images/red_pin.png';
import './BeMapCountryDropdown';
import { StateProvider } from './StateProvider';

const blueMarker = icon({
	iconUrl: bluePin,
	iconSize: [36, 36],
	iconAnchor: [18, 36],
	popupAnchor: [0, -27]
});

const redMarker = icon({
	iconUrl: redPin,
	iconSize: [36, 36],
	iconAnchor: [18, 36],
	popupAnchor: [0, -27]
});

const REGIONS: [string, [number, number]][] = [
	['Africa Regional', [15, 19]],
	['Asia Regional', [30, 89]],
	['Middle East Regional', [29, 49]],
	['Worldwide', [10, -30]],
	['Europe and Eurasia Regional', [45, 40]],
	['Latin America and the Caribbean Regional', [8.5, -80.8]]
];

const HIGHLIGHT_COLORS: Record<string, string> = {
	4: '#002F6C',
	3: 'hsl(221, 30%, 45%)',
	2: 'hsl(219, 40%, 70%)',
	// 2: '#8BA3CB',
	1: 'hsl(211, 40%, 90%)',
	0: '#CFCDC9',
	NONE: '#8C8985',
	'-1': '#651D32'
};

const COLOR_FILTER =
	'invert(71%) sepia(47%) saturate(346%) hue-rotate(185deg) brightness(150%) contrast(80%)';

@customElement('be-map')
export class BeMap extends StateProvider {
	highlightableMap: HighlightableMap;

	static styles = [
		...super.styles,
		css`
			highlightable-map {
				height: 400px;
			}

			#fy-select {
				display: inline-block;
			}

			#key {
				display: block;
				font-size: 1rem;
				margin-bottom: 0.5rem;
			}

			.legend,
			.legend > div {
				font-size: 1rem;
				display: flex;
				gap: 0.8rem;
				align-items: center;
			}
			.legend {
				flex-wrap: wrap;
				margin-bottom: 0.75rem;
			}

			.legend > *,
			.legend > * > * {
				flex: 0 1 auto;
			}

			.legend select {
				margin-bottom: 0;
			}

			.box {
				display: inline-block;
				width: 2em;
				height: 2em;
			}

			.filter {
				filter: ${unsafeCSS(COLOR_FILTER)};
			}
		`
	];

	constructor() {
		super();

		this.highlightableMap = document.createElement(
			'highlightable-map'
		) as HighlightableMap;

		this.highlightableMap.setAttribute('tooltip', '');
		this.highlightableMap.setAttribute('zoom', '2.1676183562414115');
		this.highlightableMap.setAttribute(
			'center',
			'7.515335519810181,12.495023725753168'
		);
		this.highlightableMap.addEventListener('click-country', (e: any) => {
			if (
				this.state.countries.includes(e.detail.feature.properties.ADM0_A3_US)
			) {
				this.state.setCountry(e.detail.feature.properties.ADM0_A3_US);
			}
		});

		let selectedMarker: Marker<any>;

		const regionalMarkers = new Map(
			REGIONS.map(([region, latLng]) => {
				return [
					region,
					marker(latLng, {
						icon: blueMarker,
						alt: region,
						title: region
					})
						.on('click', e => {
							console.log(e);

							const {
								sourceTarget: {
									options: { title }
								}
							} = e;

							if (title) {
								this.state.selectedCountry = title;
							}
						})
						.addTo(this.highlightableMap.leafletMap)
				];
			})
		);

		this.highlightableMap.addEventListener(
			'hm-rendered',
			() => {
				// add diagonal pattern svg to shadow root
				// this.highlightableMap.shadowRoot?.prepend(diagonalTpl());

				this.disposers.push(
					reaction(
						() => this.state.selectedCountry,
						selectedCountry => {
							// console.log(selectedCountry, regionalMarkers);
							if (selectedMarker) {
								selectedMarker.setIcon(blueMarker);
							}
							if (regionalMarkers.has(selectedCountry)) {
								selectedMarker = regionalMarkers.get(selectedCountry)!;
								selectedMarker.setIcon(redMarker);
							}
						}
					),
					autorun(() => {
						const toHighlight: string[] = [];
						Object.entries(this.state.totalYearlyDisbursements).forEach(
							([country, yearlyAmts]) => {
								const el = this.highlightableMap.countryEls.get(country);
								// reset color filter
								el?.style.removeProperty('filter');

								let fill: string;
								if (this.state.countries.includes(country)) {
									const amt = yearlyAmts[this.state.selectedFiscalYear];

									if (amt === 0) {
										// fill = 'url(#diagonal)';
										// el?.style.setProperty('filter', COLOR_FILTER);
										fill = HIGHLIGHT_COLORS.NONE;
									} else if (amt < 1e6) {
										fill = HIGHLIGHT_COLORS[1];
									} else if (amt < 5e6) {
										fill = HIGHLIGHT_COLORS[2];
									} else if (amt < 15e6) {
										fill = HIGHLIGHT_COLORS[3];
									} else {
										fill = HIGHLIGHT_COLORS[4];
									}

									toHighlight.push(country);
								} else {
									fill = HIGHLIGHT_COLORS[0];
								}

								el?.style.setProperty('fill', fill);
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
		return html`
			${this.hm}
			<b id="key"
				>Disbursement Ranges for Fiscal Year ${this.state.selectedFiscalYear}</b
			>
			<div class="legend">
				<div aria-describedby="key">
					<div
						class="box"
						style="background-color:${HIGHLIGHT_COLORS['1']}"
					></div>
					<span>$0-$1m</span>
				</div>
				<div>
					<div
						class="box"
						style="background-color:${HIGHLIGHT_COLORS['2']}"
					></div>
					<span>$1m-$5m</span>
				</div>
				<div>
					<div
						class="box"
						style="background-color:${HIGHLIGHT_COLORS['3']}"
					></div>
					<span>$5m-$15m</span>
				</div>
				<div>
					<div
						class="box"
						style="background-color:${HIGHLIGHT_COLORS['4']}"
					></div>
					<span>> $15m</span>
				</div>
				<div>
					<div
						class="box"
						style="background-color:${HIGHLIGHT_COLORS.NONE}"
					></div>
					<span>No Disbursement Reported</span>
				</div>
			</div>
			<div class="legend">
				<label for="fy-select"> <b>Select Fiscal Year:</b></label>
				<select id="fy-select" @change=${this.handleFyChange.bind(this)}>
					${this.state.fiscalYears.map(
						fy =>
							html`<option
								value="${fy}"
								?selected=${live(
									this.state.selectedFiscalYear === fy.toString()
								)}
							>
								${fy}
							</option>`
					)}
				</select>
			</div>
		`;
	}

	handleFyChange(e: InputEvent & { target: HTMLSelectElement }) {
		this.state.setSelectedFiscalYear(e.target.value);
	}

	get hm() {
		this.highlightableMap.selected = [this.state.selectedCountry];
		return this.highlightableMap;
	}
}
