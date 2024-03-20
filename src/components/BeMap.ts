import type { HighlightableMap } from 'highlightable-map';
import 'highlightable-map/dist/HighlightableMapBundled.min.js';
import { css, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { autorun } from 'mobx';
import './BeMapCountryDropdown';
import { StateProvider } from './StateProvider';
import { diagonalTpl } from './templates/diagonals';

const HIGHLIGHT_COLORS: Record<number, string> = {
	4: '#002F6C',
	3: 'hsl(221, 30%, 45%)',
	2: 'hsl(219, 40%, 70%)',
	// 2: '#8BA3CB',
	1: 'hsl(211, 40%, 90%)',
	0: '#CFCDC9',
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

			#fy-wrapper {
				margin-bottom: 0;
			}
			#fy-select {
				display: inline-block;
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

		this.highlightableMap.addEventListener(
			'hm-rendered',
			() => {
				// add diagonal pattern svg to shadow root
				this.highlightableMap.shadowRoot?.prepend(diagonalTpl());

				this.disposers.push(
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
										fill = 'url(#diagonal)';
										el?.style.setProperty('filter', COLOR_FILTER);
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
			<h4 id="fy-wrapper">
				Disbursement Ranges for Fiscal Year
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
			</h4>
			${this.hm}
			<div class="legend">
				<b id="key">Key:</b>
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
					<svg height="2rem" width="2rem" class="filter">
						<rect
							style="fill: url(#diagonal);"
							x="0"
							y="0"
							height="2rem"
							width="2rem"
						></rect>
					</svg>
					<span>No Disbursement Reported</span>
				</div>
			</div>
			${diagonalTpl()}
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
