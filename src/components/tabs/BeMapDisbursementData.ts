import { customElement } from 'lit/decorators.js';
import { StateProvider } from '../StateProvider';
import { html } from 'lit';
import '../charts/BeMapAgencyDisbursementChart';

@customElement('be-map-disbursement-data')
export class BeMapDisbursementData extends StateProvider {
	render() {
		if (this.state.disbursementsForSelectedCountryByAgency.length > 0) {
			return html`<be-map-agency-disbursement-chart></be-map-agency-disbursement-chart>`;
		} else {
			return html`<em>No data available.</em>`;
		}
	}
}
