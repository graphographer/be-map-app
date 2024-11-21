import { HighlightableMap } from 'highlightable-map';
import geodata from 'highlightable-map/src/geoJson.json';
import leafletCss from 'leaflet/dist/leaflet.css?inline';
import { html, render } from 'lit';
import lightDomStyles from '../components/styles/light-dom.scss?inline';
import agencyActivity from '../data/agency_activity.csv';
import agency_presence from '../data/agency_presence.csv';
import disbursementByAgency from '../data/disbursement_by_agency.csv';
import learningOutcomes from '../data/learning_outcomes.csv';
import output_indicators_v2 from '../data/output_indicators_v2.csv';
import { State } from '../state/State';

export async function bootstrapBeMapApp() {
	const renderBefore = document.head.lastChild;
	render(
		html` <link rel="preconnect" href="https://fonts.googleapis.com" />
			<link
				rel="preconnect"
				href="https://fonts.gstatic.com"
				crossorigin="anonymous" />
			<link
				href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,300i,400,400i,600,600i"
				rel="stylesheet" />
			<style>
				${lightDomStyles}
			</style>`,
		document.head,
		{ renderBefore }
	);

	try {
		HighlightableMap.setGeoData(geodata as unknown as JSON);
		HighlightableMap.setCss(leafletCss);
		if (!customElements.getName(HighlightableMap))
			customElements.define('highlightable-map', HighlightableMap);

		const state = new State();
		state.data.agency_presence = agency_presence;
		state.data.agency_activity = agencyActivity;
		state.data.disbursement_by_agency = disbursementByAgency;
		state.data.learning_outcomes = learningOutcomes;
		state.data.output_indicators = output_indicators_v2;
		// provider.set(state);

		return state;
	} catch (e) {
		console.error(e);
		return;
	}
}
