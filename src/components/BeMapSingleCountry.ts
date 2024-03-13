import { customElement } from 'lit/decorators.js';
import { StateProvider } from './StateProvider';
import 'highlightable-map/dist/HighlightableMapBundled.min.js';
import { css, html } from 'lit';

@customElement('be-map-single-country')
export class BeMapSingleCountry extends StateProvider {
	static styles = [
		...super.styles,
		css`
			:host {
				display: block;
				/* width: 100%; */
				height: 100%;
			}
			highlightable-map {
				--bwm-background: transparent;
				--bwm-country: transparent;
			}
		`
	];

	render() {
		return html`
			<highlightable-map
				.highlight=${[this.state.selectedCountry]}
				autozoom
				no-control
			></highlightable-map>
		`;
	}
}
