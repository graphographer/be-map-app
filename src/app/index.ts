import { html, render } from 'lit';
import { BeMapAgencyDisbursementChart } from '../components/BeMapAgencyDisbursementChart';
import '../components/BeMapApp';
import '../components/styles/light-dom.scss';
import agencyActivity from '../data/agency_activity.csv';
import agency_presence from '../data/agency_presence.csv';
import disbursementByAgency from '../data/disbursement_by_agency.csv';
import { provider } from '../state';
import { State } from '../state/State';

BeMapAgencyDisbursementChart;

const state = new State();
state.data.agency_presence = agency_presence;
state.data.agency_activity = agencyActivity;
state.data.disbursement_by_agency = disbursementByAgency;
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
