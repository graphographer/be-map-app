import '@material/web/icon/icon';
import '@material/web/tabs/primary-tab';
import '@material/web/tabs/tabs';
import './BeMap';
import './BeMapCountryActivities';
import './BeMapCountryDropdown';
import './BeMapFilters';
import './BeMapLearningOutcomesChart';
import './BeMapAgencyDisbursementChart';

import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { StateProvider } from './StateProvider';

@customElement('be-map-app')
export class BeMapApp extends StateProvider {
	static styles = [
		...super.styles,
		css`
			:host {
				display: grid;
				grid-template-columns: 1fr min(75rem, 95%) 1fr;
			}
			:host > * {
				grid-column: 2;
			}
		`
	];

	render() {
		return html` <main>
			<h4>BE Map Refresh</h4>

			<label>
				Filtered Countries
				<be-map-country-dropdown
					.countries=${this.state.filteredCountries}
					@input=${(e: InputEvent) =>
						this.state.setCountry(
							(e.composedPath()[0] as HTMLSelectElement).value
						)}
				></be-map-country-dropdown
			></label>

			<section>
				<be-map-learning-outcomes-chart></be-map-learning-outcomes-chart>
			</section>

			<section>
				<be-map></be-map>
			</section>

			<section>
				<be-map-agency-disbursement-chart></be-map-agency-disbursement-chart>
			</section>

			<be-map-filters></be-map-filters>

			${this.state.selectedCountry &&
			html`
				<section>
					<be-map-country-activities
						country=${this.state.selectedCountry}
					></be-map-country-activities>
				</section>
			`}
		</main>`;
	}
}
