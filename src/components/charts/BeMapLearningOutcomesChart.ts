import { Chart } from 'chart.js';
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { autorun, reaction } from 'mobx';
import { TLearningOutcome } from '../../types/TLearningOutcome';
import { StateProvider } from '../StateProvider';
import {
	LEVEL_POINT_STYLES,
	SUBJECT_COLORS
} from '../helpers/OUTCOME_INDICATOR_CONSTS';
import { noop } from 'lodash-es';

function getLabel(outcome: TLearningOutcome) {
	const { Subject, 'Grade Level Measured': level } = outcome;
	const maybeInt = parseInt(level);

	let parsedLevel: string;
	if (isNaN(maybeInt)) {
		parsedLevel = level;
	} else {
		parsedLevel = `Grade ${level}`;
	}

	return `${Subject}, ${parsedLevel}`;
}

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

	get data() {
		return {
			datasets: this.state.outcomeIndicatorsForSelectedCountry!.map(outcome => {
				return {
					label: getLabel(outcome),
					borderColor: SUBJECT_COLORS[outcome.Subject],
					backgroundColor: SUBJECT_COLORS[outcome.Subject],
					pointStyle: LEVEL_POINT_STYLES[outcome['Grade Level Measured']],
					pointHoverRadius: 12,
					pointRadius: 10,
					pointBorderWidth: 3,
					data: outcome.outcomes.map(([year, pct]) => ({
						x: `FY${year}`,
						y: pct
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
		this.ctx.role = 'img';
		this.ctx.innerText =
			'A data table version of this chart is available below.';
	}

	render() {
		return html`<div class="container">${this.ctx}</div> `;
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
					},
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
						usePointStyle: true,
						callbacks: {
							title(tooltipItems) {
								const [title] = tooltipItems;
								return `${title.dataset.label} Outcome (${title.label})`;
							},
							afterTitle: items => {
								const [title] = items;
								return `Baseline Year: ${
									this.state.outcomeIndicatorsForSelectedCountry[
										title.datasetIndex
									]['Baseline Year']
								}`;
							},
							label: ctx => {
								return `${ctx.formattedValue}%`;
							}
						}
					},
					legend: {
						labels: {
							usePointStyle: true,
							font: { family: '"Source Sans Pro", sans-serif', size: 17 },
							padding: 24
						},
						onClick: noop
					}
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
			),
			autorun(() => {
				const { datasetIndex, yearIndex } = this.state.highlightOutcomeData;

				this.ctx.dispatchEvent(
					new MouseEvent('mouseout', { bubbles: true, composed: true })
				);

				if (datasetIndex !== undefined && yearIndex !== undefined) {
					this.showTooltip(datasetIndex, yearIndex);
				}

				if (datasetIndex !== undefined) {
					// highlight dataset
					this.chart.data.datasets.forEach((_dataset, i) => {
						this.chart.setDatasetVisibility(i, datasetIndex === i);
					});
				} else {
					this.chart.data.datasets.forEach((_dataset, i) =>
						this.chart.setDatasetVisibility(i, true)
					);
				}

				this.chart.update('none');
			})
		);
	}

	private showTooltip(index: number, point: number) {
		const { x, y } = this.chart.getDatasetMeta(index)?.data[point];
		const { left, top } = this.ctx.getBoundingClientRect();

		this.ctx.dispatchEvent(
			new MouseEvent('mousemove', {
				clientX: x + left,
				clientY: y + top,
				bubbles: true,
				composed: true
			})
		);
	}

	disconnectedCallback(): void {
		super.disconnectedCallback();
		this.chart.destroy();
	}
}
