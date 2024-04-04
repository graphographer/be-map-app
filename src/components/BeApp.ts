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

			highlightable-map {
				--bwm-background: transparent;
				width: 150px;
				height: 150px;
				margin: 0;
			}

			be-map-donut-chart {
				height: 150px;
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

			.filter {
				border-radius: var(--standard-border-radius);
				padding: 2rem;
				background-color: var(--light-gray);
				margin-bottom: 2rem;
			}

			.filter > section {
				margin-bottom: 0;
			}

			.flex {
				display: flex;
				align-items: center;
				justify-content: center;
				column-gap: 4rem;
				row-gap: 1rem;
				margin: 3rem 0;
				max-width: 100%;
				flex-wrap: wrap;
			}

			.flex > * {
				flex: 0 0 auto;
				max-width: 100%;
			}

			/* @media (max-width: 719px) {
				.flex highlightable-map {
					display: none;
				}
			} */
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

				<div class="filter">
					<section>
						<be-map-filters></be-map-filters>
						<h4 id="results-heading">
							Filter Results (${this.state.filteredCountries.length}
							${this.state.filteredCountries.length === 1
								? 'Country'
								: 'Countries'})
						</h4>
						<be-map-country-dropdown
							aria-describedby="results-heading"
							.countries=${this.state.filteredCountries}
						></be-map-country-dropdown>
					</section>
				</div>

				<section id="overview">
					<div class="flex">
						<h2>${this.state.selectedCountryFormatted}</h2>
						${this.state.selectedCountry
							? html`
									<highlightable-map
										class="shrink"
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
						${this.state.agencyDisbursementsForSelectedCountryAndFY
							? html` <h4 class="sr-only">
										${this.state.selectedCountryFormatted}: Overview
									</h4>
									<be-map-donut-chart class="grow"></be-map-donut-chart>`
							: ''}
					</div>

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
			</main>
		`;
	}

	protected async scheduleUpdate() {
		await document.fonts.ready;
		super.scheduleUpdate();
	}
}
