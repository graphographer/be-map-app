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
import './BeMapDonutChart';

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
		return html`
			<main>
				<h4>BE Map Refresh</h4>
				<be-map-country-dropdown
					.countries=${this.state.countries}
				></be-map-country-dropdown>
				<be-map-donut-chart></be-map-donut-chart>
			</main>
		`;
	}
}
