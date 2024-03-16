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
			:host {
				display: flex;
				gap: 1rem;
			}

			label {
				display: block;
			}
			select {
				width: 100%;
			}
			.container {
				width: 100%;
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: 1rem;
			}
			.container > div {
				height: 100%;
			}
			details {
				background-color: initial;
			}

			summary::marker {
				content: '';
			}
			summary {
				font-weight: normal;
				word-break: break-word;
				display: flex;
				justify-content: space-between;
			}

			summary:after {
				transform: scaleY(0.5);
				content: '\u25BC';
			}

			details[open] > summary:after {
				content: '\u25B2';
			}

			@media screen and (max-width: 779px) {
				.container {
					grid-template-columns: 1fr;
				}
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
						@change=${this.handleAgencyChange.bind(this)}
						aria-describedby="filter-description"
					>
						<summary>
							<span
								>${this.state.filter.agencies?.length
									? this.state.filter.agencies.join(', ')
									: 'No agencies selected'}</span
							>
							<span class="marker"></span>
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
						aria-describedby="education-filter-description"
						@change=${this.handleEducationChange.bind(this)}
					>
						<summary>
							${this.state.filter.educationLevels?.length
								? this.state.filter.educationLevels.join(', ')
								: 'No education levels selected'}
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
		`;
	}
}
