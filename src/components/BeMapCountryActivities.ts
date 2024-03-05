import { customElement, property } from 'lit/decorators.js';
import { StateProvider } from './StateProvider';
import { PropertyValueMap, html } from 'lit';
import { agencyNameSwitcher } from './helpers/agencyNameSwitcher';

@customElement('be-map-country-activities')
export class BeMapCountryActivities extends StateProvider {
	@property({ type: String, reflect: true })
	country: string = '';

	get countryActivies() {
		return this.state.activitesByCountry[this.country];
	}

	render() {
		if (!this.countryActivies?.length) return '';

		return html`${this.countryActivies.map(activity => {
			const {
				Agency,
				'Activity Name': name,
				'Start Year': start,
				'End Year': end,
				Implementer,
				Description,
				'Link to Website': link,
				educationLevels
			} = activity;

			return html`
				<details>
					<summary>
						${name} ${Agency && `(${agencyNameSwitcher(Agency)})`}
					</summary>

					${Implementer && html`<b>Implementer:</b> ${Implementer}`}
					${start
						? html`<p>
								<b>Years active:</b> ${start}${start !== 'Ongoing' && end
									? `-${end}`
									: ''}
						  </p>`
						: ''}
					${Description && html`<p><b>Description:</b> ${Description}</p>`}
					${link
						? html`<p>
								<b>Link:</b> <a href="${link}" target="_blank">${link}</a>
						  </p>`
						: ''}
					${educationLevels.length
						? html`<p>
								<b>Education levels targeted:</b> ${educationLevels.join(', ')}
						  </p>`
						: ''}
				</details>
			`;
		})}`;
	}

	protected updated(
		_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
	): void {
		if (_changedProperties.has('country')) {
			this.shadowRoot
				?.querySelectorAll('details')
				.forEach(detail => detail.removeAttribute('open'));
		}
	}
}
