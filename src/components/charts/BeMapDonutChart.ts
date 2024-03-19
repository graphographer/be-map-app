import { Chart } from 'chart.js';
import { PropertyValueMap, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { computed, makeObservable, reaction } from 'mobx';
import { StateProvider } from '../StateProvider';
import { USD_FORMATTER } from '../helpers/USD_FORMATTER';
import { AGENCIES_LONG_TO_SHORT, TAgency } from '../../types/TAgency';
import { styleMap } from 'lit/directives/style-map.js';

const HIGHLIGHT_COLORS: Record<string, string> = {
	USAID: '#002F6C',
	'Millenium Challenge Corporation': '#0067B9',
	'The Peace Corps': '#A7C6ED',
	'U.S. Department of Agriculture': '#205493',
	'U.S. Department of Labor': '#651D32',
	'U.S. Department of State': '#BA0C2F'
};

@customElement('be-map-donut-chart')
export class BeMapDonutChart extends StateProvider {
	static styles = [
		...super.styles,
		css`
			:host {
				display: block;
			}

			.container {
				position: relative;
				height: 100%;
				display: flex;
			}

			.flex {
				display: flex;
				height: 100%;
				gap: 1rem;
				align-items: center;
			}
			.grow {
				flex-grow: 1;
			}

			table {
				margin: 0;
				width: 100%;
			}
			td {
				padding: 0.2rem;
			}
			td:last-of-type {
				text-align: end;
			}

			.box {
				display: inline-block;
				width: 1rem;
				height: 1rem;
				margin-right: 0.2rem;
			}
		`
	];

	ctx: HTMLCanvasElement;
	chart!: Chart<'doughnut'>;

	constructor() {
		super();

		this.ctx = document.createElement('canvas');

		makeObservable(this, { data: computed });
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
		const entries = Object.entries(
			this.state.agencyDisbursementsForSelectedCountryAndFY
		).filter(([, amt]) => amt > 0);
		const total = entries.reduce((acc, [, amt]) => {
			acc += amt;
			return acc;
		}, 0);
		const formatted = entries.map(([agency, amt]) => [
			AGENCIES_LONG_TO_SHORT[agency as TAgency],
			USD_FORMATTER.format(amt),
			HIGHLIGHT_COLORS[agency]
		]);

		return html`<div class="flex">
			<div class="container">${this.ctx}</div>
			<div class="grow">
				<table>
					<tbody>
						${formatted.map(
							([agency, amt, bg]) => html`
								<tr>
									<td>
										<div
											class="box"
											style=${styleMap({
												'background-color': bg
											})}
										></div>
										<b>${agency}:</b>
									</td>
									<td>${amt}</td>
								</tr>
							`
						)}
					</tbody>
					<tfoot>
						<tr>
							<td><b>FY${this.state.selectedFiscalYear} Total:</b></td>
							<td>${USD_FORMATTER.format(total)}</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>`;
	}

	protected firstUpdated(
		_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
	): void {
		this.chart = new Chart<'doughnut'>(this.ctx, {
			type: 'doughnut',
			data: this.data,
			options: {
				maintainAspectRatio: false,
				responsive: true,
				plugins: {
					tooltip: {
						enabled: true,
						callbacks: {
							label(ctx) {
								return USD_FORMATTER.format(ctx.parsed);
							}
						}
					},
					legend: {
						display: false,
						position: 'right'
					}
				}
			}
		});

		this.chart.resize();

		this.disposers.push(
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

// <table>
// 	<caption>
// 		Total Agency Disbursements for ${this.state.selectedCountryFormatted}
// 		in Fiscal Year ${this.state.selectedFiscalYear}
// 	</caption>
// 	<thead>
// 		<tr>
// 			<td scope="col">Agency</td>
// 			<td scope="col">Disbursement</td>
// 		</tr>
// 	</thead>
// 	<tbody>
// 		$
// 		{Object.entries(this.state.agencyDisbursementsForSelectedCountryAndFY)
// 			.filter(([, amt]) => !!amt)
// 			.map(([agency, amt]) => {
// 				return html`<tr>
// 					<td>${agency}</td>
// 					<td>${USD_FORMATTER.format(amt)}</td>
// 				</tr>`;
// 			})}
// 	</tbody>
// </table>;
