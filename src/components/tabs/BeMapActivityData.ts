import { customElement } from 'lit/decorators.js';
import { StateProvider } from '../StateProvider';
import { PropertyValueMap, html } from 'lit';

@customElement('be-map-activity-data')
export class BeMapActivityData extends StateProvider {
	render() {
		return html`
			<p>Click on the title for more information about each activity.</p>
			${Object.entries(this.state.activitiesForSelectedCountryByAgency).map(
				([agency, activities]) => {
					return html`
						<h4>${agency}</h4>

						${activities.map(activity => {
							const {
								'Activity Name': name,
								'Start Year': start,
								'End Year': end,
								Implementer,
								Description,
								'Link to Website': link
							} = activity;

							const dates = start === 'Ongoing' ? start : `${start}-${end}`;

							return html` <details>
								<summary>${name}</summary>
								${start && end && Implementer
									? html`<p>
											${dates}
											<br />
											${Implementer}
									  </p>`
									: ''}
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
