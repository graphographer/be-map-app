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
import { AGENCIES_LONG_TO_SHORT, TAgency } from '../types/TAgency';
import { AGENCIES_SHORT, TAgencyShort } from '../types/TAgencyShort';
import { TDisbursementByAgency } from '../types/TDisbursementByAgency';
import { StateProvider } from './StateProvider';
import { agencyNameSwitcher } from './helpers/agencyNameSwitcher';
import { countryNameFormatter } from './helpers/countryNameFormatter';

const HIGHLIGHT_COLORS: Record<string, string> = {
	USAID: 'red',
	'Millenium Challenge Corporation': 'orange',
	'The Peace Corps': 'yellow',
	'U.S. Department of Agriculture': 'green',
	'U.S. Department of Labor': 'blue',
	'U.S. Department of State': 'violet',
	MCC: 'orange',
	PC: 'yellow',
	USDA: 'green',
	DOL: 'blue',
	DOS: 'violet'
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
				border-radius: var(--standard-border-radius);
				border: 1px solid var(--border);
				margin-bottom: -1px;
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

	get agenciesDisbursingShort() {
		return this.countryDisbursementsByAgency.map(([agencyLong]) =>
			agencyNameSwitcher(agencyLong)
		);
	}

	get data(): ChartData<'bar', { x: string; y: number }[]> {
		return {
			datasets: this.countryDisbursementsByAgency
				.filter(([agency]) => {
					return this.agencyFilter.has(AGENCIES_LONG_TO_SHORT[agency]);
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

	agencyFilter = new Set<string>(AGENCIES_SHORT);

	constructor() {
		super();

		this.ctx = document.createElement('canvas');
		this.ctx.width = 800;
		this.ctx.height = 500;

		makeObservable(this, {
			country: computed,
			toggleAgency: action,
			agencyFilter: observable,
			agenciesDisbursingShort: computed,
			countryDisbursementsByAgency: computed,
			data: computed
		});
	}

	toggleAgency(agency: TAgencyShort, include: boolean) {
		if (include) {
			this.agencyFilter.add(agency);
		} else {
			this.agencyFilter.delete(agency);
		}
		this.agencyFilter = new Set(this.agencyFilter);
	}

	render() {
		return html` ${this.agenciesDisbursingShort.length > 1
				? html`<form
						@change=${(e: InputEvent) => {
							this.toggleAgency(
								(e.target as HTMLInputElement)?.value as TAgencyShort,
								(e.target as HTMLInputElement).checked
							);
						}}
				  >
						Filter by disbursing agency
						<br />
						${this.agenciesDisbursingShort.map(agency => {
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
