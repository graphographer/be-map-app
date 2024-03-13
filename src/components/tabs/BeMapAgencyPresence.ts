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
			table {
				width: 100%;
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
		['USAID', 'USAID'],
		['USDA', 'U.S. Department of Agriculture']
	];

	static educationLevels: TEducationLevel[] = [
		'Pre-Primary',
		'Primary',
		'Secondary',
		'Workforce Development',
		'Education Systems Strengthening'
	];

	render() {
		return html`
			<table>
				<caption>
					<h3>USG BE Support by Education Level(s) and Agency</h3>
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
										${this.state.agencyEducationSupportForSelectedCountry[
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

			<p>
				<b>Supporting Agencies:</b>
				${this.state.agenciesInSelectedCountry.join(', ')}
			</p>
		`;
	}
}
