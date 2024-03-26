import { customElement } from 'lit/decorators.js';
import { StateProvider } from '../StateProvider';
import { PropertyValueMap, html } from 'lit';
import { isEmpty } from 'lodash-es';

@customElement('be-map-activity-data')
export class BeMapActivityData extends StateProvider {
	render() {
		return isEmpty(this.state.activitiesForSelectedCountryByAgency)
			? html`<em>No data available.</em>`
			: html`
					<p>Click on the title for more information about each program.</p>
					${Object.entries(this.state.activitiesForSelectedCountryByAgency).map(
						([agency, activities]) => {
							return html`
								<h5>${agency}</h5>

								${activities.map(activity => {
									const {
										'Activity Name': name,
										'Start Year': start,
										'End Year': end,
										Implementer,
										Description,
										educationLevels,
										'Link to Website': link
									} = activity;

									const dates = start === 'Ongoing' ? start : `${start}-${end}`;

									return html` <details>
										<summary>${name}</summary>
										<p>
											${start && end ? html`<b>Years Active:</b> ${dates}` : ''}
											${Implementer
												? html`${dates.trim() ? html`<br />` : ''}
														<b>Implementer:</b> ${Implementer}`
												: ''}
											${educationLevels.length
												? html`${Implementer.trim() ? html`<br />` : ''}
														<b>Education Levels:</b> ${educationLevels.join(
															', '
														)}`
												: ''}
										</p>
										<p>${Description}</p>
										${link
											? html`<p>
													<a href="${link}" target="_blank">Link to program</a>
											  </p>`
											: ''}
									</details>`;
								})}
							`;
						}
					)}
			  `;
	}

	protected updated(
		_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
	): void {
		this.shadowRoot
			?.querySelectorAll('details')
			.forEach(el => el.removeAttribute('open'));
	}
}
