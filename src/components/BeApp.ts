import './BeHighlightableMap';
import './BeMap';
import './BeMapCountryDropdown';
import './BeMapFilters';
import './BeMapTabs';
import './charts/BeMapDonutChart';
import './tabs/BeMapActivityData';
import './tabs/BeMapAgencyPresence';
import './tabs/BeMapDisbursementData';
import './tabs/BeMapOutcomeIndicators';
import './tabs/BeMapOutputIndicators';

import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StateProvider } from './StateProvider';

@customElement('be-app')
export class BeApp extends StateProvider {
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

			#results-heading {
				margin-bottom: -2rem;
			}

			highlightable-map {
				--bwm-background: transparent;
				width: 100px;
				height: 100px;
			}

			be-map-donut-chart {
				height: 150px;
				margin-bottom: 3rem;
			}

			be-map-tabs {
				min-height: 40rem;
				border-radius: var(--standard-border-radius);
			}

			be-map-filters,
			be-map-country-dropdown,
			be-map-donut-chart {
				background-color: transparent;
			}

			.flex {
				display: flex;
				align-items: center;
				column-gap: 1rem;
				height: 150px;
				margin-bottom: -2rem;
			}

			.flex > .grow {
				flex-grow: 1;
			}

			.lower {
				border-radius: var(--standard-border-radius);
				padding: 2rem;
				background-color: var(--light-gray);
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
				title: 'Program Data',
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
				title: 'Results',
				template: () =>
					html`<be-map-output-indicators></be-map-output-indicators>`
			},
			{
				route: 'outcome',
				title: 'Learning Outcomes',
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

				<div class="lower">
					<section>
						<be-map-filters></be-map-filters>
					</section>

					<section id="overview">
						<h4 id="results-heading">
							Filter Results (${this.state.filteredCountries.length}
							${this.state.filteredCountries.length === 1
								? 'Country'
								: 'Countries'})
						</h4>
						<div class="flex">
							<be-map-country-dropdown
								class="grow"
								aria-describedby="results-heading"
								.countries=${this.state.filteredCountries}
							></be-map-country-dropdown>

							${this.state.selectedCountry
								? html`
										<highlightable-map
											role="img"
											alt="The shape of ${this.state.selectedCountryFormatted}"
											tabindex="-1"
											no-control
											autozoom
											highlight="${this.state.selectedCountry}"
											filter="${this.state.selectedCountry}"
										></highlightable-map>
								  `
								: ''}
						</div>

						${this.state.agencyDisbursementsForSelectedCountryAndLatestFY
							? html` <h4 class="sr-only">
										${this.state.selectedCountryFormatted}: Overview
									</h4>
									<be-map-donut-chart></be-map-donut-chart>`
							: ''}
						${this.state.selectedCountry
							? html` <h4 class="sr-only">
										${this.state.selectedCountryFormatted}: Details
									</h4>
									<be-map-tabs
										.config=${this.tabsConfig}
										.activeTab=${'presence'}
									></be-map-tabs>`
							: ''}
					</section>
				</div>
			</main>
		`;
	}

	protected async scheduleUpdate() {
		await document.fonts.ready;
		super.scheduleUpdate();
	}
}
