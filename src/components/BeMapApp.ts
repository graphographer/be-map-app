import '@material/web/icon/icon';
import '@material/web/tabs/primary-tab';
import '@material/web/tabs/tabs';
import './BeMap';
import './BeMapAgencyDisbursementChart';
import './BeMapCountryActivities';
import './BeMapCountryDropdown';
import './BeMapFilters';
import './BeMapLearningOutcomesChart';
import './BeMapLearningOutcomesTable';
import './BeMapTabs';

import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
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

	get tabsConfig() {
		return [
			{
				route: 'overview',
				title: 'Overview',
				template: () => html`<h3>Overview</h3>`
			},
			{
				route: 'indicators',
				title: 'Indicators',
				template: () => html`<h3>Indicators</h3>`
			},
			{
				route: 'outcomes',
				title: 'Outcomes',
				template: () => html`<h3>Outcomes</h3>`
			},
			{
				route: 'disbursements',
				title: 'Disbursements',
				template: () => html`<h3>Disbursements</h3>`
			},
			{
				route: 'activities',
				title: 'Activities',
				template: () => html`<h3>Activities</h3>`
			}
		];
	}

	render() {
		return html` <main>
			<h4>BE Map Refresh</h4>

			<section>
				<be-map></be-map>
				<be-map-country-dropdown
					.countries=${this.state.countries}
				></be-map-country-dropdown>
			</section>

			<be-map-tabs .config=${this.tabsConfig}></be-map-tabs>

			<section>
				<be-map-learning-outcomes-table .country=${this.state.selectedCountry}>
				</be-map-learning-outcomes-table>
				<be-map-learning-outcomes-chart></be-map-learning-outcomes-chart>
			</section>

			<section>
				<be-map></be-map>
			</section>

			<section>
				<be-map-agency-disbursement-chart></be-map-agency-disbursement-chart>
			</section>

			<be-map-filters></be-map-filters>

			${this.state.selectedCountry
				? html`
						<section>
							<be-map-country-activities
								country=${this.state.selectedCountry}
							></be-map-country-activities>
						</section>
				  `
				: ''}
		</main>`;
	}
}
