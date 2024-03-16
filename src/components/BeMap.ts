import type { HighlightableMap } from 'highlightable-map';
import 'highlightable-map/dist/HighlightableMapBundled.min.js';
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { autorun } from 'mobx';
import './BeMapCountryDropdown';
import { StateProvider } from './StateProvider';
import { live } from 'lit/directives/live.js';

const HIGHLIGHT_COLORS: Record<number, string> = {
	4: '#002F6C',
	3: 'hsl(221, 30%, 45%)',
	2: 'hsl(219, 40%, 70%)',
	// 2: '#8BA3CB',
	1: 'hsl(211, 40%, 90%)',
	0: '#CFCDC9',
	'-1': '#651D32'
};

@customElement('be-map')
export class BeMap extends StateProvider {
	highlightableMap: HighlightableMap;

	static styles = [
		...super.styles,
		css`
			highlightable-map {
				height: 500px;
			}

			.legend,
			.legend > div {
				font-size: 1rem;
				display: flex;
				gap: 1rem;
				align-items: center;
			}
			.legend {
				flex-wrap: wrap;
			}

			.legend > * {
				flex: 1 1 auto;
			}

			.legend select {
				margin-bottom: 0;
			}

			.box {
				display: inline-block;
				width: 2em;
				height: 2em;
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
		// this.highlightableMap.setAttribute('autozoom', '');
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
								const el = this.highlightableMap.countryEls.get(country);

								let fill: string;
								if (this.state.filteredCountries.includes(country)) {
									const amt = yearlyAmts[this.state.selectedFiscalYear];

									if (amt < 1e6) {
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
		return html`${this.hm}
			<div class="legend">
				<b>Disbursement Ranges</b>
				<div>
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
					<label for="fy-select"><b>Fiscal Year</b></label>
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
			</div> `;
	}

	handleFyChange(e: InputEvent & { target: HTMLSelectElement }) {
		this.state.setSelectedFiscalYear(e.target.value);
	}

	get hm() {
		this.highlightableMap.selected = [this.state.selectedCountry];
		return this.highlightableMap;
	}
}
