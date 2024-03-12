import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import {
	action,
	autorun,
	computed,
	makeObservable,
	observable,
	runInAction
} from 'mobx';
import { StateProvider } from './StateProvider';
import { countryNameFormatter } from '../data/helpers/countryNameFormatter';

@customElement('be-map-learning-outcomes-table')
export class BeMapLearningOutcomesTable extends StateProvider {
	static styles = [
		...super.styles,
		css`
			.container {
				overflow-x: auto;
			}
			caption {
				text-align: left;
			}
			td[data-outcome]:hover {
				background-color: var(--usaid-red-tint);
			}
		`
	];

	country: string = '';
	get data() {
		return this.state.data.learning_outcomes.filter(
			data => data.Country === this.country
		);
	}
	get years() {
		return [
			...new Set(
				this.data.map(datum => datum.outcomes.map(([year]) => year)).flat()
			)
		];
	}

	constructor() {
		super();

		makeObservable(this, {
			country: observable,
			data: computed,
			handleMouseover: action
		});

		this.disposers.push(
			autorun(() => {
				runInAction(
					() =>
						(this.state.outcomeIndexesToChart = new Array(
							this.data.length
						).fill(true))
				);
			})
		);
	}

	render() {
		return this.data
			? html`
					<div class="container" @mouseover=${this.handleMouseover.bind(this)}>
						<table>
							<caption>
								Learning Outcomes for ${countryNameFormatter(this.country)}
							</caption>
							<thead>
								<tr>
									<td scope="col" rowspan="2">Render?</td>
									<td scope="col" rowspan="2">Subject</td>
									<td scope="col" rowspan="2">Grade Level</td>
									<td scope="col" rowspan="2">Baseline Year</td>
									<td scope="col" colspan=${this.years.length}>Outcomes</td>
								</tr>
								<tr>
									${this.years.map(year => html`<td>${year}</td>`)}
								</tr>
							</thead>
							<tbody @change=${this.handleRenderToggle.bind(this)}>
								${this.data.map((datum, i) => {
									return html`
										<tr>
											<td>
												<input
													type="checkbox"
													value=${i}
													.checked=${live(this.state.outcomeIndexesToChart[i])}
												/>
											</td>
											<td>${datum.Subject}</td>
											<td>${datum['Grade Level Measured']}</td>
											<td>${datum['Baseline Year']}</td>
											${datum.outcomes.map(([, outcome], j) => {
												if (outcome) {
													return html`<td
														data-outcome=${i}
														data-year-index=${j}
													>
														${outcome}%
													</td>`;
												} else {
													return html`<td></td>`;
												}
											})}
										</tr>
									`;
								})}
							</tbody>
						</table>
					</div>
			  `
			: '';
	}

	private handleRenderToggle(e: InputEvent) {
		const { currentTarget } = e;

		(currentTarget as HTMLElement)?.querySelectorAll('input').forEach(el => {
			const { checked, value } = el;
			const i = parseInt(value);
			this.state.outcomeIndexesToChart[i] = checked;
		});
	}
	handleMouseover(e: MouseEvent) {
		const { target } = e;

		const { outcome, yearIndex } = (target as HTMLElement)?.dataset;
		if (outcome && yearIndex) {
			this.state.highlightOutcomeData = [
				parseInt(outcome),
				parseInt(yearIndex)
			];
		} else {
			this.state.highlightOutcomeData = [];
		}
	}
}
