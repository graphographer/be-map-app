import { Chart } from 'chart.js';
import { PropertyValueMap, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { computed, makeObservable, reaction } from 'mobx';
import { StateProvider } from '../StateProvider';
import { USD_FORMATTER } from '../helpers/USD_FORMATTER';
import { AGENCIES_LONG_TO_SHORT, TAgency } from '../../types/TAgency';
import { styleMap } from 'lit/directives/style-map.js';
import { HIGHLIGHT_COLORS } from './BeMapAgencyDisbursementChart';

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
				max-width: 250px;
			}

			@media (max-width: 720px) {
				.grow {
					max-width: 100%;
				}
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
		if (!this.state.agencyDisbursementsForSelectedCountryAndLatestFY) {
			return;
		}
		return {
			labels: Object.keys(
				this.state.agencyDisbursementsForSelectedCountryAndLatestFY
			),
			datasets: [
				{
					data: Object.values(
						this.state.agencyDisbursementsForSelectedCountryAndLatestFY
					),
					backgroundColor: Object.keys(
						this.state.agencyDisbursementsForSelectedCountryAndLatestFY
					).map(agency => HIGHLIGHT_COLORS[agency])
				}
			]
		};
	}

	render() {
		if (!this.state.agencyDisbursementsForSelectedCountryAndLatestFY) return '';

		const entries = Object.entries(
			this.state.agencyDisbursementsForSelectedCountryAndLatestFY
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
							<td><b>FY${this.state.latestFY} Total:</b></td>
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
		if (!this.data) return;

		this.chart = new Chart<'doughnut'>(this.ctx, {
			type: 'doughnut',
			data: this.data,
			options: {
				maintainAspectRatio: false,
				responsive: true,
				plugins: {
					tooltip: {
						enabled: false,
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
					if (!data) return;

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
