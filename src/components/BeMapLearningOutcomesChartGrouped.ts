import { Chart } from 'chart.js';
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { computed, makeObservable, reaction } from 'mobx';
import { StateProvider } from './StateProvider';

const HIGHLIGHT_COLORS: string[] = [
	'#002F6C',
	'#0067B9',
	'#A7C6ED',
	'#205493',
	'#651D32',
	'#BA0C2F'
];

@customElement('be-map-learning-outcomes-chart-grouped')
export class BeMapLearningOutomesChartGrouped extends StateProvider {
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

	get countryOutcomes() {
		return this.state.data.learning_outcomes.filter(
			outcome => outcome.Country === this.state.selectedCountry
		);
	}

	get data() {
		return {
			datasets: this.countryOutcomes.map(outcome => {
				const { Subject: subject, 'Grade Level Measured': level } = outcome;

				return {
					label: `${subject} Grade ${level}`,
					// borderColor: SUBJECT_COLORS[outcome.Subject],
					backgroundColor: this.highlightColors[`${subject}:${level}`],
					// tension: 0.3,
					// segment: {
					// 	borderDash(ctx: ScriptableLineSegmentContext) {
					// 		return ctx.p0.skip || ctx.p1.skip ? [6, 6] : undefined;
					// 	}
					// },
					data: outcome.outcomes.map(([year, pct]) => ({
						x: `FY${year}`,
						y: pct
					}))
				};
			})
		};
	}

	get highlightColors() {
		return this.countryOutcomes.reduce<Record<string, string>>(
			(acc, outcome, i) => {
				const { 'Grade Level Measured': level, Subject: subject } = outcome;
				if (!acc[`${subject}:${level}`]) {
					acc[`${subject}:${level}`] = HIGHLIGHT_COLORS[i];
				}
				return acc;
			},
			{}
		);
	}

	constructor() {
		super();

		this.ctx = document.createElement('canvas');
		this.ctx.width = 800;
		this.ctx.height = 500;

		makeObservable(this, { highlightColors: computed });

		// @ts-ignore
		window.chart = this;
	}

	render() {
		return html`<div class="container">${this.ctx}</div> `;
	}

	firstUpdated() {
		this.chart = new Chart<'bar', { x: string; y: number }[]>(this.ctx, {
			type: 'bar',
			data: this.data,

			options: {
				maintainAspectRatio: false,
				scales: {
					y: {
						min: 0,
						max: 100,
						ticks: {
							callback(tickValue) {
								return `${tickValue}%`;
							}
						}
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
								return `${ctx.formattedValue}%`;
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
