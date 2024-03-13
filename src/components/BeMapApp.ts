import './BeMapCountryDropdown';
import './BeMapTabs';
import './tabs/BeMapAgencyPresence';
import './tabs/BeMapActivityData';
import './tabs/BeMapDisbursementData';
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

			highlightable-map {
				height: 500px;
			}
		`
	];

	get tabsConfig() {
		return [
			{
				route: 'presence',
				title: 'Agency Presence',
				template: () => html`<be-map-agency-presence></be-map-agency-presence>`
			},
			{
				route: 'activity',
				title: 'Activity Data',
				template: () => html`<be-map-activity-data></be-map-activity-data>`
			},
			{
				route: 'disbursement',
				title: 'Disbursement Data',
				template: () =>
					html`<be-map-disbursement-data></be-map-disbursement-data>`
			},
			{
				route: 'output',
				title: 'Ouput Indicators',
				template: () => html`<h3>Ouput Indicators</h3>`
			},
			{
				route: 'outcome',
				title: 'Outcome Indicators',
				template: () => html`<h3>Outcome Indicators</h3>`
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

				<be-map-tabs
					.config=${this.tabsConfig}
					.activeTab=${'disbursement'}
				></be-map-tabs>
			</main>
		`;
	}
}

// <section id="overview">
// 	<be-map-single-country></be-map-single-country>
// 	<be-map-donut-chart></be-map-donut-chart>
// </section>;
