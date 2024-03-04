import {
	BarController,
	BarElement,
	CategoryScale,
	Chart,
	ChartData,
	LinearScale,
	Title,
	Tooltip
} from 'chart.js';
import { PropertyValueMap, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { computed, makeObservable } from 'mobx';
import { TAgency } from '../types/TAgency';
import { TDisbursementByAgency } from '../types/TDisbursementByAgency';
import { StateProvider } from './StateProvider';

const HIGHLIGHT_COLORS: Record<string, string> = {
	USAID: 'red',
	'Millenium Challenge Corporation': 'orange',
	'The Peace Corps': 'yellow',
	'U.S. Department of Agriculture': 'green',
	'U.S. Department of Labor': 'blue',
	'U.S. Department of State': 'violet'
};

const USD_FORMATTER = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
});

const getTitle = (country: string) =>
	`Yearly Disbursements to ${country} (by Agency)`;

Chart.register(
	CategoryScale,
	LinearScale,
	BarElement,
	BarController,
	Tooltip,
	Title
);

@customElement('be-map-agency-disbursement-chart')
export class BeMapAgencyDisbursementChart extends StateProvider {
	static styles = [
		...super.styles,
		css`
			.container {
				position: relative;
			}
		`
	];

	ctx: HTMLCanvasElement;
	chart!: Chart<'bar', { x: string; y: number }[]>;

	@property({ type: String, reflect: true })
	country: string = '';

	get countryDisbursementsByAgency(): [TAgency, TDisbursementByAgency][] {
		return this.state.data.disbursement_by_agency
			.filter(disbursement => disbursement.Country === this.country)
			.map(disbursement => {
				return [disbursement.Agency, disbursement];
			});
	}

	get data(): ChartData<'bar', { x: string; y: number }[]> {
		return {
			datasets: this.countryDisbursementsByAgency.map(
				([agency, disbursement]) => {
					return {
						label: agency,
						data: disbursement.Disbursements.map(([fy, amount]) => {
							return { x: fy.toString(), y: amount };
						}),
						backgroundColor: HIGHLIGHT_COLORS[agency]
					};
				}
			)
		};
	}

	constructor() {
		super();

		this.ctx = document.createElement('canvas');
		this.ctx.width = 800;
		this.ctx.height = 500;

		makeObservable(this, {
			// country: observable,
			// setCountry: action,
			countryDisbursementsByAgency: computed,
			data: computed
		});

		// @ts-ignore
		window.chart = this;
	}

	render() {
		return html`<div class="container">${this.ctx}</div>`;
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
	}

	protected updated(
		_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
	): void {
		if (_changedProperties.has('country')) {
			Object.assign(this.chart.data, this.data);
			this.chart.options.plugins!.title!.text = getTitle(this.country);
			this.chart.update();
		}
	}

	disconnectedCallback(): void {
		super.disconnectedCallback();
		this.chart.destroy();
	}
}
