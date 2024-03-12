import { customElement, property } from 'lit/decorators.js';
import { StateProvider } from './StateProvider';
import { html } from 'lit';
import { live } from 'lit/directives/live.js';
import { countryNameFormatter } from '../data/helpers/countryNameFormatter';

@customElement('be-map-country-dropdown')
export class BeMapCountryDropdown extends StateProvider {
	@property({ type: Array })
	countries: string[] = [];

	render() {
		return html`
			<select>
				<option value="" ?selected=${live(this.state.selectedCountry === '')}>
					None selected
				</option>
				${this.countries.map(countryCode => {
					return html`<option
						value="${countryCode}"
						?selected=${live(this.state.selectedCountry === countryCode)}
					>
						${countryNameFormatter(countryCode)}
					</option>`;
				})}
			</select>
		`;
	}
}
