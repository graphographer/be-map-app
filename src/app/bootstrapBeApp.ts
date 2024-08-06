import { HighlightableMap } from 'highlightable-map';
import lightDomStyles from '../components/styles/light-dom.scss?inline';
import { provider } from '../state';
import { State } from '../state/State';
import { BeApp } from '../components/BeApp';
import { html, render } from 'lit';

async function bootstrapBeApp() {
	const renderBefore = document.head.lastChild;
	render(
		html`<style>
			${lightDomStyles}
		</style>`,
		document.head,
		{ renderBefore }
	);

	try {
		const [
			{ default: geodata },
			{ default: leafletCss },
			{ default: agencyActivity },
			{ default: agency_presence },
			{ default: disbursementByAgency },
			{ default: learningOutcomes },
			{ default: output_indicators_v2 }
		] = await Promise.all([
			import('highlightable-map/src/geoJson.json'),
			import('leaflet/dist/leaflet.css?inline'),
			import('../data/agency_activity.csv'),
			import('../data/agency_presence.csv'),
			import('../data/disbursement_by_agency.csv'),
			import('../data/learning_outcomes.csv'),
			import('../data/output_indicators_v2.csv')
		]);

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

		// @ts-ignore
		window.state = state;

		customElements.define('be-app', BeApp);
	} catch (e) {
		console.error(e);
		return;
	}
}

bootstrapBeApp();
