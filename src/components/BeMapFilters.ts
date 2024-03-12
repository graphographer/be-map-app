import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { makeObservable, observable } from 'mobx';
import { EDUCATION_LEVELS } from '../types/EEducationLevel';
import { AGENCIES_LONG } from '../types/TAgency';
import { StateProvider } from './StateProvider';

@customElement('be-map-filters')
export class BeMapFilters extends StateProvider {
	static styles = [
		css`
			:host {
				display: flex;
				gap: 1rem;
			}

			label {
				flex-grow: 1;
			}
			select {
				width: 100%;
			}
		`,
		...super.styles
	];

	constructor() {
		super();
		makeObservable(this, { agencySelection: observable });
	}

	agencySelection: string[] = [];

	render() {
		return html`
			<label
				>Agency
				<details>
					<summary>
						${this.agencySelection.length
							? this.agencySelection.join(', ')
							: 'No agencies selected'}
					</summary>
					${AGENCIES_LONG.map(
						agency =>
							html`<input
							type="checkbox"
								value=${agency}
								.checked=${live(!!this.state.filter.agencies?.includes(agency))}
							>
								${agency}
							</option>`
					)}
				</details>
			</label>
			<label
				>Education Level
				<select
					@change=${(e: any) =>
						this.state.setFilter({ educationLevels: e.target.value })}
				>
					<option
						value=""
						?selected=${live(!this.state.filter.educationLevels)}
					>
						None selected
					</option>
					${EDUCATION_LEVELS.map(
						level =>
							html`<option
								value=${level}
								?selected=${live(
									this.state.filter.educationLevels?.includes(level)
								)}
							>
								${level}
							</option>`
					)}
				</select>
			</label>
		`;
	}
}
