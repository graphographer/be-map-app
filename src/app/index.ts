import { html, render } from 'lit';
import '../components/BeMapApp';
import '../components/styles/light-dom.scss';
import agencyActivity from '../data/agency_activity.csv';
import agency_presence from '../data/agency_presence.csv';
import disbursementByAgency from '../data/disbursement_by_agency.csv';
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
provider.set(state);

// @ts-ignore
window.state = state;

render(
	html`
		<link
			rel="stylesheet"
			media="all"
			href="//fonts.googleapis.com/css?family=Source+Sans+Pro"
		/>
	`,
	document.head
);

render(html`<be-map-app></be-map-app>`, document.body);
