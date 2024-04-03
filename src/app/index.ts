import { html, render } from 'lit';
import '../components/BeApp';
import '../components/styles/light-dom.scss';
import agencyActivity from '../data/agency_activity.csv';
import agency_presence from '../data/agency_presence.csv';
import disbursementByAgency from '../data/disbursement_by_agency.csv';
import learningOutcomes from '../data/learning_outcomes.csv';
import output_indicators_v2 from '../data/output_indicators_v2.csv';
import { provider } from '../state';
import { State } from '../state/State';

import {
	ArcElement,
	BarController,
	BarElement,
	CategoryScale,
	Chart,
	DoughnutController,
	Legend,
	LineController,
	LineElement,
	LinearScale,
	PointElement,
	Title,
	Tooltip
} from 'chart.js';
import { HighlightableMap } from 'highlightable-map';

Chart.register(
	CategoryScale,
	LinearScale,
	BarElement,
	BarController,
	Tooltip,
	Title,
	LineController,
	LineElement,
	PointElement,
	DoughnutController,
	ArcElement,
	Legend
);

const state = new State();
state.data.agency_presence = agency_presence;
state.data.agency_activity = agencyActivity;
state.data.disbursement_by_agency = disbursementByAgency;
state.data.learning_outcomes = learningOutcomes;
state.data.output_indicators = output_indicators_v2;
provider.set(state);

async function start() {
	try {
		const [{ default: geodata }, { default: leafletCss }] = await Promise.all([
			import('highlightable-map/src/geoJson.json'),
			import('leaflet/dist/leaflet.css?inline')
		]);

		HighlightableMap.setGeoData(geodata as unknown as JSON);

		HighlightableMap.setCss(leafletCss);

		customElements.define('highlightable-map', HighlightableMap);
		// @ts-ignore
		window.state = state;

		render(html`<be-app></be-app>`, document.body);
	} catch (e) {
		console.error(e);
		return;
	}
}

render(
	html`
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link
			rel="preconnect"
			href="https://fonts.gstatic.com"
			crossorigin="anonymous"
		/>
		<link
			href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,300i,400,400i,600,600i"
			rel="stylesheet"
		/>
	`,
	document.head
);

start();
