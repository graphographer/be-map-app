import { html, render } from 'lit';
import '../components/BeMapApp';
import '../components/styles/light-dom.scss';
import agencyActivity from '../data/agency_activity.csv';
import agency_presence from '../data/agency_presence.csv';
import disbursementByAgency from '../data/disbursement_by_agency.csv';
import output_indicators from '../data/output_indicators.csv';
import { provider } from '../state';
import { State } from '../state/State';
import learningOutcomes from '../data/learning_outcomes.csv';

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
state.data.output_indicators = output_indicators;
provider.set(state);

// @ts-ignore
window.state = state;

render(
	html`
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link
			rel="preconnect"
			href="https://fonts.gstatic.com"
			crossorigin="anonymous"
		/>
		<link
			href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro"
			rel="stylesheet"
		/>
	`,
	document.head
);

render(html`<be-map-app></be-map-app>`, document.body);
