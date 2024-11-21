import { BeApp } from '../components/BeApp';
import { bootstrapBeMapApp } from './bootstrapBeMapApp';

bootstrapBeMapApp().then(state => {
	customElements.define('be-app', BeApp);
	// @ts-ignore
	window.state = state;
});
