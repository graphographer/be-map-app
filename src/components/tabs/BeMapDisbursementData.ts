import { customElement } from 'lit/decorators.js';
import { StateProvider } from '../StateProvider';
import { html } from 'lit';
import '../charts/BeMapAgencyDisbursementChart';

@customElement('be-map-disbursement-data')
export class BeMapDisbursementData extends StateProvider {
	render() {
		return html`<be-map-agency-disbursement-chart></be-map-agency-disbursement-chart>`;
	}
}
