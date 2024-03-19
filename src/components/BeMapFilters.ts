import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { EDUCATION_LEVELS, TEducationLevel } from '../types/EEducationLevel';
import { AGENCIES_LONG, TAgency } from '../types/TAgency';
import { StateProvider } from './StateProvider';

@customElement('be-map-filters')
export class BeMapFilters extends StateProvider {
	static styles = [
		...super.styles,
		css`
			.container {
				display: grid;
				grid-template-columns: 1fr 1fr;
				column-gap: 1rem;
			}

			@media (max-width: 699px) {
				.container {
					display: block;
				}
			}

			label {
				display: inline-block;
			}
			details {
				background-color: var(--bg);
			}
			summary {
				font-weight: normal;
				padding: 0.5rem;
			}
			summary::marker {
				content: '';
			}
			summary:after {
				float: right;
				transform: scaleY(0.5);
				content: '\u25BC';
			}
			details[open] summary:after {
				content: '\u25B2';
			}
		`
	];

	handleAgencyChange(e: InputEvent & { target: HTMLInputElement }) {
		const agencySelection = new Set(this.state.filter.agencies);

		if (e.target.checked) {
			agencySelection.add(e.target.value as TAgency);
		} else {
			agencySelection.delete(e.target.value as TAgency);
		}

		this.state.setFilter({ agencies: [...agencySelection] });
	}
	handleEducationChange(e: InputEvent & { target: HTMLInputElement }) {
		const educationLevels = new Set(this.state.filter.educationLevels);

		if (e.target.checked) {
			educationLevels.add(e.target.value as TEducationLevel);
		} else {
			educationLevels.delete(e.target.value as TEducationLevel);
		}

		this.state.setFilter({ educationLevels: [...educationLevels] });
	}

	render() {
		return html`
			<div class="container">
				<div>
					<span id="agency-filter-description"
						>Filter for the following agencies:</span
					>
					<details
						class="dropdown"
						@change=${this.handleAgencyChange.bind(this)}
						aria-describedby="filter-description"
					>
						<summary>
							<i
								>${this.state.filter.agencies?.length
									? this.state.filter.agencies.join(', ')
									: 'No agencies selected'}</i
							>
						</summary>
						${AGENCIES_LONG.map(
							agency =>
								html`<label>
									<input
										type="checkbox"
										value=${agency}
										.checked=${live(
											!!this.state.filter.agencies?.includes(agency)
										)}
									/>
									${agency}
								</label> `
						)}
					</details>
				</div>
				<div>
					<span id="education-filter-description"
						>Filter for the following education levels:</span
					>
					<details
						class="dropdown"
						aria-describedby="education-filter-description"
						@change=${this.handleEducationChange.bind(this)}
					>
						<summary>
							<i>
								${this.state.filter.educationLevels?.length
									? this.state.filter.educationLevels.join(', ')
									: 'No education levels selected'}</i
							>
						</summary>
						${EDUCATION_LEVELS.map(
							level =>
								html`<label>
									<input
										type="checkbox"
										value=${level}
										.checked=${live(
											!!this.state.filter.educationLevels?.includes(level)
										)}
									/>
									${level}
								</label> `
						)}
					</details>
				</div>
			</div>
			<p>
				<i>
					Filtered results appear in the dropdown list below. Results represent
					agencies and programs active as of fiscal year 2023. Select a country
					to see more detailed information.
				</i>
				<br />
				<button class="link" @click=${this.clearFilters.bind(this)}>
					Clear Filters
				</button>
			</p>
		`;
	}

	clearFilters() {
		this.state.filter = {};
	}
}
