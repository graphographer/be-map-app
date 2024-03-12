import { Chart } from 'chart.js';
import { PropertyValueMap, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { makeObservable, reaction } from 'mobx';
import { StateProvider } from './StateProvider';

const HIGHLIGHT_COLORS: Record<string, string> = {
	USAID: '#002F6C',
	'Millenium Challenge Corporation': '#0067B9',
	'The Peace Corps': '#A7C6ED',
	'U.S. Department of Agriculture': '#205493',
	'U.S. Department of Labor': '#651D32',
	'U.S. Department of State': '#BA0C2F'
};

const USD_FORMATTER = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
});

@customElement('be-map-donut-chart')
export class BeMapDonutChart extends StateProvider {
	static styles = [
		...super.styles,
		css`
			.container {
				position: relative;
			}
		`
	];

	ctx: HTMLCanvasElement;
	chart!: Chart<'doughnut'>;

	constructor() {
		super();

		this.ctx = document.createElement('canvas');
		this.ctx.width = 800;
		this.ctx.height = 500;

		makeObservable(this, {});
	}

	get data() {
		return {
			labels: Object.keys(
				this.state.agencyDisbursementsForSelectedCountryAndFY
			),
			datasets: [
				{
					data: Object.values(
						this.state.agencyDisbursementsForSelectedCountryAndFY
					),
					backgroundColor: Object.keys(
						this.state.agencyDisbursementsForSelectedCountryAndFY
					).map(agency => HIGHLIGHT_COLORS[agency])
				}
			]
		};
	}

	render() {
		return html`<div class="container">${this.ctx}</div>
			<table>
				<caption>
					Total Agency Disbursements for ${this.state.selectedCountryFormatted}
					in Fiscal Year ${this.state.selectedFiscalYear}
				</caption>
				<thead>
					<tr>
						<td scope="col">Agency</td>
						<td scope="col">Disbursement</td>
					</tr>
				</thead>
				<tbody>
					${Object.entries(
						this.state.agencyDisbursementsForSelectedCountryAndFY
					)
						.filter(([, amt]) => !!amt)
						.map(([agency, amt]) => {
							return html`<tr>
								<td>${agency}</td>
								<td>${USD_FORMATTER.format(amt)}</td>
							</tr>`;
						})}
				</tbody>
			</table>`;
	}

	protected firstUpdated(
		_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
	): void {
		this.chart = new Chart<'doughnut'>(this.ctx, {
			type: 'doughnut',
			data: this.data,
			options: {
				maintainAspectRatio: false,
				plugins: {
					tooltip: {
						enabled: true,
						callbacks: {
							label(ctx) {
								return USD_FORMATTER.format(ctx.parsed);
							}
						}
					}
				}
			}
		});

		this.disposers.push(
			reaction(
				() => this.data,
				data => {
					this.chart.data = data;
					this.chart.update();
				}
			)
		);
	}

	disconnectedCallback(): void {
		super.disconnectedCallback();
		this.chart.destroy();
	}
}
