import { Chart, ChartData } from 'chart.js';
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { styleMap } from 'lit/directives/style-map.js';
import {
	action,
	autorun,
	computed,
	makeObservable,
	observable,
	reaction
} from 'mobx';
import { countryNameFormatter } from '../../data/helpers/countryNameFormatter';
import { AGENCIES_LONG, TAgency } from '../../types/TAgency';
import { StateProvider } from '../StateProvider';
import { USD_FORMATTER } from '../helpers/USD_FORMATTER';

const HIGHLIGHT_COLORS: Record<string, string> = {
	USAID: '#002F6C',
	'Millenium Challenge Corporation': '#0067B9',
	'The Peace Corps': '#A7C6ED',
	'Peace Corps': '#A7C6ED',
	'U.S. Department of Agriculture': '#205493',
	'U.S. Department of Labor': '#651D32',
	'U.S. Department of State': '#BA0C2F',
	'U.S. Agency for International Development': '#651d32'
};

const getTitle = (country: string) =>
	`Yearly Disbursements to ${countryNameFormatter(country)} (by Agency)`;

@customElement('be-map-agency-disbursement-chart')
export class BeMapAgencyDisbursementChart extends StateProvider {
	static styles = [
		...super.styles,
		css`
			.container {
				position: relative;
			}

			form label {
				display: inline-block;
			}

			label:not(:last-child) {
				margin-right: 1.2rem;
			}

			input[type='checkbox'] {
				width: 3rem;
				height: 3rem;
				font-size: 3rem;
			}

			input[type='checkbox']:checked::after {
				left: 0.185em;
			}

			form {
				margin-bottom: 2rem;
			}
		`
	];

	ctx: HTMLCanvasElement;
	chart!: Chart<'bar', { x: string; y: number }[]>;

	get data(): ChartData<'bar', { x: string; y: number }[]> {
		return {
			datasets: this.state.disbursementsForSelectedCountryByAgency
				.filter(([agency]) => {
					return this.agencyFilter.has(agency);
				})
				.map(([agency, disbursement]) => {
					return {
						label: agency,
						data: disbursement.Disbursements.map(([fy, amount]) => {
							return { x: fy.toString(), y: amount };
						}),
						backgroundColor: HIGHLIGHT_COLORS[agency]
					};
				})
		};
	}

	get agencies() {
		return this.state.disbursementsForSelectedCountryByAgency.map(
			([agency]) => agency
		);
	}

	get years() {
		return [
			...new Set(
				this.state.disbursementsForSelectedCountryByAgency
					.map(([, disbursement]) =>
						disbursement.Disbursements.map(([year]) => year)
					)
					.flat()
			)
		];
	}

	agencyFilter = new Set<TAgency>();

	constructor() {
		super();

		this.ctx = document.createElement('canvas');
		this.ctx.width = 800;
		this.ctx.height = 500;
		this.ctx.role = 'img';
		this.ctx.innerText =
			'A data table alternative for this graphical chart is available below.';

		makeObservable(this, {
			toggleAgency: action,
			agencyFilter: observable,
			agencies: computed,
			data: computed
		});

		this.disposers.push(
			autorun(() => {
				this.agencyFilter = new Set(this.agencies);
			})
		);

		// @ts-ignore
		window.chart = this;
	}

	toggleAgency(agency: TAgency, include: boolean) {
		if (include) {
			this.agencyFilter.add(agency);
		} else {
			this.agencyFilter.delete(agency);
		}
		// this.agencyFilter = new Set(this.agencyFilter);
	}

	render() {
		return html`
			<h4>
				Yearly Disbursements to ${this.state.selectedCountryFormatted} by Agency
			</h4>

			<form
				@change=${(e: InputEvent) => {
					this.toggleAgency(
						(e.target as HTMLInputElement)?.value as TAgency,
						(e.target as HTMLInputElement).checked
					);
				}}
			>
				<fieldset>
					<legend><b>Toggle agency visibility</b></legend>

					${this.agencies.map(agency => {
						return html`
							<label>
								<input
									style=${styleMap({
										'background-color': HIGHLIGHT_COLORS[agency]
									})}
									type="checkbox"
									value="${agency}"
									.checked=${live(this.agencyFilter.has(agency))}
								/>
								${agency}
							</label>
						`;
					})}
				</fieldset>
			</form>

			<div class="container">${this.ctx}</div>

			<table class="sr-only">
				<thead>
					<tr>
						<th scope="col" rowspan="2">Agency</th>
						<th scope="col" colspan=${AGENCIES_LONG.length}>
							Disbursement for Fiscal Year
						</th>
					</tr>
					<tr>
						${this.years.map(year => {
							return html`<th scope="col">${year}</th>`;
						})}
					</tr>
				</thead>
				<tbody>
					${this.state.disbursementsForSelectedCountryByAgency.map(
						([agency, disbursement]) => {
							return html`<tr>
								<th scope="row">${agency}</th>
								${disbursement.Disbursements.map(([_year, amt]) => {
									return html`<td>${USD_FORMATTER.format(amt)}</td>`;
								})}
							</tr>`;
						}
					)}
				</tbody>
			</table>
		`;
	}

	firstUpdated() {
		this.chart = new Chart<'bar', { x: string; y: number }[]>(this.ctx, {
			type: 'bar',
			data: this.data,
			options: {
				maintainAspectRatio: false,
				scales: {
					x: {
						stacked: true
						// ticks: {
						// 	callback(year) {
						// 		return `FY${year}`;
						// 	}
						// }
						// title: { display: true, text: 'Fiscal Year' }
					},
					y: {
						stacked: true,
						display: true,
						ticks: {
							callback(tickValue) {
								return USD_FORMATTER.format(tickValue as number);
							}
						}
						// title: { display: true, text: 'Total Disbursement (USD)' }
					}
				},
				plugins: {
					tooltip: {
						enabled: true,
						callbacks: {
							title(tooltipItems) {
								const [title] = tooltipItems;
								return `${title.dataset.label} FY${title.label}`;
							},
							label(ctx) {
								return `$${ctx.formattedValue}`;
							}
						}
					},
					legend: {
						display: false
					}
					// title: {
					// 	display: true,
					// 	text: getTitle(this.state.selectedCountry)
					// }
				}
			}
		});

		this.disposers.push(
			reaction(
				() => this.state.selectedCountry,
				country => {
					this.chart.options.plugins!.title!.text = getTitle(country);
					this.chart.update('none');
				}
			),
			reaction(
				() => this.data,
				data => {
					this.chart.data = data;
					this.chart.update('none');
				}
			)
		);
	}

	disconnectedCallback(): void {
		super.disconnectedCallback();
		this.chart.destroy();
	}
}
