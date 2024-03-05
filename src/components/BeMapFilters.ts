import { customElement } from 'lit/decorators.js';
import { StateProvider } from './StateProvider';
import { css, html } from 'lit';
import { EDUCATION_LEVELS } from '../types/EEducationLevel';
import { AGENCIES_LONG } from '../types/TAgency';
import { live } from 'lit/directives/live.js';
import { agencyNameSwitcher } from './helpers/agencyNameSwitcher';

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

	render() {
		return html`
			<label
				>Agency
				<select
					@change=${(e: any) =>
						this.state.setFilter({ agency: e.target.value })}
				>
					<option value="" ?selected=${live(!this.state.filter.agency)}>
						None selected
					</option>
					${AGENCIES_LONG.map(
						agency =>
							html`<option
								value=${agencyNameSwitcher(agency)}
								?selected=${live(
									this.state.filter.agency === agencyNameSwitcher(agency)
								)}
							>
								${agency}
							</option>`
					)}
				</select>
			</label>
			<label
				>Education Level
				<select
					@change=${(e: any) =>
						this.state.setFilter({ educationLevel: e.target.value })}
				>
					<option value="" ?selected=${live(!this.state.filter.educationLevel)}>
						None selected
					</option>
					${EDUCATION_LEVELS.map(
						level =>
							html`<option
								value=${level}
								?selected=${live(this.state.filter.educationLevel === level)}
							>
								${level}
							</option>`
					)}
				</select>
			</label>
		`;
	}
}
