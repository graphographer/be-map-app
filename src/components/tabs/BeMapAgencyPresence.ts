import { customElement } from 'lit/decorators.js';
import { StateProvider } from '../StateProvider';
import { css, html } from 'lit';
import { TAgency } from '../../types/TAgency';
import { TEducationLevel } from '../../types/EEducationLevel';

@customElement('be-map-agency-presence')
export class BeMapAgencyPresence extends StateProvider {
	static styles = [
		...super.styles,
		css`
			:host {
				overflow-x: auto;
			}
			table {
				width: 100%;
				margin-top: 0;
			}

			ul {
				margin-top: 0;
			}

			thead th {
				text-align: center;
			}

			.checked {
				width: 1rem;
				height: 1rem;
				margin: 0 auto;
				background-color: var(--usaid-red);
			}
		`
	];

	static agencies: [string, TAgency][] = [
		['DOL', 'U.S. Department of Labor'],
		['DOS', 'U.S. Department of State'],
		['MCC', 'Millenium Challenge Corporation'],
		['PC', 'The Peace Corps'],
		['USAID', 'U.S. Agency for International Development'],
		['USDA', 'U.S. Department of Agriculture']
	];

	static educationLevels: TEducationLevel[] = [
		'Pre-Primary',
		'Primary',
		'Secondary',
		'Workforce Development',
		'Education Systems Strengthening',
		'Education Levels Not Specified'
	];

	render() {
		if (this.state.agencyEducationSupportForSelectedCountry) {
			return html`
				<table>
					<caption>
						<h4>
							USG BE Support by Education Level(s) and Agency for Fiscal Year
							${this.state.latestFY}
						</h4>
					</caption>
					<thead>
						<tr>
							<th scope="col">
								<span class="sr-only">Education Support Type</span>
							</th>
							${BeMapAgencyPresence.agencies.map(([short]) => {
								return html`<th scope="col">${short}</th> `;
							})}
						</tr>
					</thead>
					<tbody>
						${BeMapAgencyPresence.educationLevels.map(level => {
							return html`<tr>
								<th scope="row">${level}</th>
								${BeMapAgencyPresence.agencies.map(([_short, long]) => {
									return html`
										<td>
											${this.state.agencyEducationSupportForSelectedCountry![
												long
											]?.includes(level)
												? html`<div class="checked">
														<span class="sr-only">&check;</span>
												  </div>`
												: ''}
										</td>
									`;
								})}
							</tr>`;
						})}
					</tbody>
				</table>

				<b>Supporting Agencies:</b>
				<ul>
					${BeMapAgencyPresence.agencies
						.filter(([, long]) =>
							this.state.agenciesInSelectedCountry?.includes(long)
						)
						.map(([short, long]) => html`<li>${short} (${long})</li>`)}
				</ul>
			`;
		} else {
			return html`<h4>
					USG BE Support by Education Level(s) and Agency for Fiscal Year
					${this.state.latestFY}
				</h4>
				<em>No data available.</em>`;
		}
	}
}
