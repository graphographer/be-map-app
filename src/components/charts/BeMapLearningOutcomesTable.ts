import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { action, computed, makeObservable } from 'mobx';
import { StateProvider } from '../StateProvider';

@customElement('be-map-learning-outcomes-table')
export class BeMapLearningOutcomesTable extends StateProvider {
	static styles = [
		...super.styles,
		css`
			.container {
				overflow-x: auto;
			}
			table {
				width: 100%;
			}
			caption {
				text-align: left;
			}
			.bottom {
				vertical-align: bottom;
			}
			.cursor-default {
				cursor: default;
			}
			td:not(:nth-child(1)) {
				text-align: center;
			}
			td[data-outcome]:hover {
				background-color: var(--usaid-red-tint);
			}
		`
	];

	get years() {
		return [
			...new Set(
				this.state.outcomeIndicatorsForSelectedCountry
					.map(datum => datum.outcomes.map(([year]) => year))
					.flat()
			)
		];
	}

	constructor() {
		super();

		makeObservable(this, {
			years: computed,
			handleMouseover: action
		});
	}

	render() {
		return this.state.outcomeIndicatorsForSelectedCountry.length
			? html`
					<div class="container" @mouseover=${this.handleMouseover.bind(this)}>
						<table>
							<caption>
								Learning Outcomes for ${this.state.selectedCountryFormatted}
							</caption>
							<thead>
								<tr>
									<td scope="col" rowspan="2" class="bottom">Subject</td>
									<td scope="col" rowspan="2" class="bottom">Grade Level</td>
									<td scope="col" rowspan="2" class="bottom">Baseline Year</td>
									<td scope="col" colspan="${this.years.length}">
										Fiscal Year
									</td>
								</tr>
								<tr>
									${this.years.map(year => html`<td>${year}</td>`)}
								</tr>
							</thead>
							<tbody>
								${this.state.outcomeIndicatorsForSelectedCountry.map(
									(datum, i) => {
										return html`
											<tr data-dataset-index=${i}>
												<td>${datum.Subject}</td>
												<td>${datum['Grade Level Measured']}</td>
												<td>${datum['Baseline Year']}</td>
												${datum.outcomes.map(([, outcome], j) => {
													if (!isNaN(outcome)) {
														return html`<td
															class="cursor-default"
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
									}
								)}
							</tbody>
						</table>
					</div>
			  `
			: html`<em>No data is available.</em>`;
	}

	handleMouseover(e: MouseEvent) {
		const yearIndex = (e.composedPath() as HTMLElement[]).find(
			el => el instanceof HTMLTableCellElement
		)?.dataset.yearIndex;
		const datasetIndex = (e.composedPath() as HTMLElement[]).find(
			el => el instanceof HTMLTableRowElement
		)?.dataset.datasetIndex;

		this.state.highlightOutcomeData = {
			datasetIndex: datasetIndex ? parseInt(datasetIndex) : undefined,
			yearIndex: yearIndex ? parseInt(yearIndex) : undefined
		};
	}
}
