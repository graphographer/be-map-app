import { HighlightableMap } from 'highlightable-map';
import { html, render } from 'lit';
import lightDomStyles from '../components/styles/light-dom.scss?inline';
import { provider } from '../state';
import { State } from '../state/State';
import geodata from 'highlightable-map/src/geoJson.json';
import leafletCss from 'leaflet/dist/leaflet.css?inline';
import agencyActivity from '../data/agency_activity.csv';
import agency_presence from '../data/agency_presence.csv';
import disbursementByAgency from '../data/disbursement_by_agency.csv';
import learningOutcomes from '../data/learning_outcomes.csv';
import output_indicators_v2 from '../data/output_indicators_v2.csv';

export async function bootstrapBeMapApp() {
	const renderBefore = document.head.lastChild;
	render(
		html`<style>
			${lightDomStyles}
		</style>`,
		document.head,
		{ renderBefore }
	);

	try {
		HighlightableMap.setGeoData(geodata as unknown as JSON);
		HighlightableMap.setCss(leafletCss);
		customElements.define('highlightable-map', HighlightableMap);

		const state = new State();
		state.data.agency_presence = agency_presence;
		state.data.agency_activity = agencyActivity;
		state.data.disbursement_by_agency = disbursementByAgency;
		state.data.learning_outcomes = learningOutcomes;
		state.data.output_indicators = output_indicators_v2;
		provider.set(state);

		return state;
	} catch (e) {
		console.error(e);
		return;
	}
}
