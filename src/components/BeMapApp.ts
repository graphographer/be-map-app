import './BeMapCountryDropdown';
import './BeMapTabs';
import './tabs/BeMapAgencyPresence';
import './tabs/BeMapActivityData';
import './tabs/BeMapDisbursementData';
import './tabs/BeMapOutputIndicators';
import './tabs/BeMapOutcomeIndicators';
import '../components/BeMapFilters';
import '../components/BeMap';
import 'highlightable-map/dist/HighlightableMapBundled.min.js';
import './charts/BeMapDonutChart';

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
				--bwm-background: transparent;
				width: 100px;
				height: 100px;
			}

			.flex {
				display: flex;
				align-items: center;
				column-gap: 1rem;
				flex-wrap: wrap;
			}

			.flex > .grow {
				flex-grow: 1;
			}

			#overview be-map-country-dropdown {
				width: 15rem;
			}
			#overview highlightable-map {
				width: 5rem;
			}

			#overview > * {
				height: 150px;
				flex: 1 1 50%;
			}

			#overview .break {
				flex: 1 0 100%;
				height: 0;
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
					html`<be-map-disbursement-data></be-map-disbursement-data>`,
				disabled: () => {
					return !this.state.disbursementsForSelectedCountryByAgency.length;
				}
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
				template: () =>
					html`<be-map-outcome-indicators></be-map-outcome-indicators>`
			}
		];
	}

	render() {
		return html`
			<main>
				<section>
					<be-map></be-map>
				</section>

				<section>
					<be-map-filters></be-map-filters>
				</section>

				<section id="overview" class="flex">
					<div class="flex">
						<be-map-country-dropdown
							class="grow"
							.countries=${this.state.filteredCountries}
						></be-map-country-dropdown>
						<highlightable-map
							role="img"
							alt="The shape of ${this.state.selectedCountryFormatted}"
							tabindex="-1"
							no-tooltip
							no-control
							autozoom
							highlight="${this.state.selectedCountry}"
							filter="${this.state.selectedCountry}"
						></highlightable-map>
					</div>
					<div class="break"></div>
					<be-map-donut-chart></be-map-donut-chart>
				</section>

				${this.state.selectedCountry
					? html`<be-map-tabs
							.config=${this.tabsConfig}
							.activeTab=${'outcome'}
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
