import { customElement } from 'lit/decorators.js';
import { StateProvider } from './StateProvider';
import { html } from 'lit';
import { live } from 'lit/directives/live.js';

@customElement('be-map-country-dropdown')
export class BeMapCountryDropdown extends StateProvider {
	render() {
		return html`
			<label>
				Select a country
				<select>
					<option value="" ?selected=${live(this.state.selectedCountry === '')}>
						None selected
					</option>
					${this.state.countries.map(country => {
						return html`<option
							value="${country}"
							?selected=${live(this.state.selectedCountry === country)}
						>
							${country}
						</option>`;
					})}
				</select>
			</label>
		`;
	}
}
