import { html, render } from 'lit';
import '../components/BeMapApp';
import { AgencyPresence, State } from '../state/State';
import { provider } from '../state';
import '../components/styles/light-dom.css';
import agency_presence from '../data/agency_presence.csv';

const state = new State();
state.data.agency_presence = agency_presence as AgencyPresence[];
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
