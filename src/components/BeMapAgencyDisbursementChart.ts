import { Chart, ChartData } from 'chart.js';
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { styleMap } from 'lit/directives/style-map.js';
import {
	action,
	computed,
	makeObservable,
	observable,
	reaction,
	runInAction
} from 'mobx';
import { threeAlphasToName } from '../data/countryNameTo3Alpha';
import { countryNameFormatter } from '../data/helpers/countryNameFormatter';
import { AGENCIES_LONG, TAgency } from '../types/TAgency';
import { AGENCIES_SHORT, TAgencyShortDTO } from '../types/TAgencyShort';
import { TDisbursementByAgency } from '../types/TDisbursementByAgency';
import { StateProvider } from './StateProvider';

const HIGHLIGHT_COLORS: Record<string, string> = {
	USAID: '#002F6C',
	'Millenium Challenge Corporation': '#0067B9',
	'The Peace Corps': '#A7C6ED',
	'U.S. Department of Agriculture': '#205493',
	'U.S. Department of Labor': '#651D32',
	'U.S. Department of State': '#BA0C2F',
	MCC: '#0067B9',
	PC: '#A7C6ED',
	USDA: '#205493',
	DOL: '#651D32',
	DOS: '#BA0C2F'
};

const USD_FORMATTER = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
});

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
			.box {
				display: inline-block;
				height: 1rem;
				width: 1rem;
				/* border-radius: var(--standard-border-radius); */
				border: 1px solid var(--border);
				margin-bottom: -1px;
			}
			label:not(:last-child) {
				margin-right: 1.2rem;
			}
		`
	];

	ctx: HTMLCanvasElement;
	chart!: Chart<'bar', { x: string; y: number }[]>;

	get country() {
		return this.state.selectedCountry;
	}

	get countryDisbursementsByAgency(): [TAgency, TDisbursementByAgency][] {
		return this.state.data.disbursement_by_agency
			.filter(
				disbursement =>
					disbursement.Country === threeAlphasToName.get(this.country)?.[0] &&
					disbursement.Disbursements.some(([, amount]) => !!amount)
			)
			.map(disbursement => {
				return [disbursement.Agency, disbursement];
			});
	}

	get data(): ChartData<'bar', { x: string; y: number }[]> {
		return {
			datasets: this.countryDisbursementsByAgency
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

	agencyFilter = new Set<string>(AGENCIES_LONG);

	constructor() {
		super();

		this.ctx = document.createElement('canvas');
		this.ctx.width = 800;
		this.ctx.height = 500;

		makeObservable(this, {
			country: computed,
			toggleAgency: action,
			agencyFilter: observable,
			countryDisbursementsByAgency: computed,
			data: computed
		});
	}

	toggleAgency(agency: TAgencyShortDTO, include: boolean) {
		if (include) {
			this.agencyFilter.add(agency);
		} else {
			this.agencyFilter.delete(agency);
		}
		this.agencyFilter = new Set(this.agencyFilter);
	}

	render() {
		return html` ${this.agencyFilter.size > 1
				? html`<form
						@change=${(e: InputEvent) => {
							this.toggleAgency(
								(e.target as HTMLInputElement)?.value as TAgencyShortDTO,
								(e.target as HTMLInputElement).checked
							);
						}}
				  >
						Filter by disbursing agency
						<br />
						${[...this.agencyFilter].map(agency => {
							return html`
								<label>
									<input
										type="checkbox"
										value="${agency}"
										.checked=${live(this.agencyFilter.has(agency))}
									/>
									${agency}
									<div
										class="box"
										style=${styleMap({
											'background-color': HIGHLIGHT_COLORS[agency]
										})}
									></div>
								</label>
							`;
						})}
				  </form>`
				: ''}

			<div class="container">${this.ctx}</div>`;
	}

	firstUpdated() {
		this.chart = new Chart<'bar', { x: string; y: number }[]>(this.ctx, {
			type: 'bar',
			data: this.data,
			options: {
				maintainAspectRatio: false,
				scales: {
					x: {
						stacked: true,
						title: { display: true, text: 'Fiscal Year' }
					},
					y: {
						stacked: true,
						display: true,
						ticks: {
							callback(tickValue) {
								return USD_FORMATTER.format(tickValue as number);
							}
						},
						title: { display: true, text: 'Total Disbursement (USD)' }
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
					title: {
						display: true,
						text: getTitle(this.country)
					}
				}
			}
		});

		this.disposers.push(
			reaction(
				() => this.country,
				country => {
					this.chart.options.plugins!.title!.text = getTitle(country);
					this.chart.update('none');

					// reset filters
					runInAction(() => (this.agencyFilter = new Set(AGENCIES_SHORT)));
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
