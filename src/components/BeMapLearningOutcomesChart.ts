import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StateProvider } from './StateProvider';
import { Chart } from 'chart.js';
import { reaction } from 'mobx';
import { ScriptableLineSegmentContext } from 'chart.js';

const SUBJECT_COLORS: { [k: string]: string } = {
	Reading: 'orange',
	Math: 'violet',
	'Reading Disability': 'forestgreen'
};

@customElement('be-map-learning-outcomes-chart')
export class BeMapLearningOutcomesChart extends StateProvider {
	static styles = [
		...super.styles,
		css`
			.container {
				position: relative;
			}
		`
	];

	ctx: HTMLCanvasElement;
	chart!: Chart<'line', { x: string; y: number }[]>;

	get countryOutcomes() {
		return this.state.data.learning_outcomes.filter(
			outcome => outcome.Country === this.state.selectedCountry
		);
	}

	get data() {
		return {
			datasets: this.countryOutcomes.map(outcome => {
				return {
					label: outcome.Subject,
					borderColor: SUBJECT_COLORS[outcome.Subject],
					backgroundColor: SUBJECT_COLORS[outcome.Subject],
					tension: 0.3,
					segment: {
						borderDash(ctx: ScriptableLineSegmentContext) {
							return ctx.p0.skip || ctx.p1.skip ? [6, 6] : undefined;
						}
					},
					data: outcome.outcomes.map(([year, pct]) => ({
						x: `FY${year}`,
						y: pct ? pct * 100 : pct
					}))
				};
			})
		};
	}

	constructor() {
		super();

		this.ctx = document.createElement('canvas');
		this.ctx.width = 800;
		this.ctx.height = 500;

		// @ts-ignore
		window.chart = this;
	}

	render() {
		return html`<div class="container">${this.ctx}</div>
			<pre><code>${JSON.stringify(
				this.countryOutcomes,
				undefined,
				2
			)}</code></pre> `;
	}

	firstUpdated() {
		this.chart = new Chart<'line', { x: string; y: number }[]>(this.ctx, {
			type: 'line',
			data: this.data,
			options: {
				spanGaps: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						stacked: true
						// title: { display: true, text: 'Fiscal Year' }
					},
					y: {
						min: 0,
						max: 100,
						// stacked: true,
						// display: true
						ticks: {
							callback(tickValue) {
								return `${tickValue}%`;
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
								return `${title.dataset.label} Outcome (${title.label})`;
							},
							label: ctx => {
								const { datasetIndex } = ctx;
								const { Subject, 'Grade Level Measured': level } =
									this.countryOutcomes[datasetIndex];
								return `${Subject}, grade level ${level}: ${ctx.formattedValue}%`;
							}
						}
					}
					// title: {
					// 	display: true,
					// 	text: getTitle(this.country)
					// }
				}
			}
		});

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
