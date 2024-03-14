import './BeMapCountryDropdown';
import './BeMapTabs';
import './tabs/BeMapAgencyPresence';
import './tabs/BeMapActivityData';
import './tabs/BeMapDisbursementData';
import './tabs/BeMapOutputIndicators';
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StateProvider } from './StateProvider';

@customElement('be-map-app')
export class BeMapApp extends StateProvider {
	static styles = [
		...super.styles,
		css`
			:host {
				display: block;
				padding: 0 1rem;
			}

			main {
				margin: 0 auto;
				max-width: 960px;
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
				template: () =>
					html`<be-map-output-indicators></be-map-output-indicators>`,
				disabled: () => {
					return !this.state.outputIndicatorsForSelectedCountry;
				}
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

				${this.state.selectedCountry
					? html`<be-map-tabs
							.config=${this.tabsConfig}
							.activeTab=${'output'}
					  ></be-map-tabs>`
					: ''}
			</main>
		`;
	}
}

// <section id="overview">
// 	<be-map-single-country></be-map-single-country>
// 	<be-map-donut-chart></be-map-donut-chart>
// </section>;
