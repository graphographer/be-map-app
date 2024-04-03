import { customElement, property } from 'lit/decorators.js';
import { StateProvider } from './StateProvider';
import { css, html } from 'lit';
import { live } from 'lit/directives/live.js';
import { repeat } from 'lit/directives/repeat.js';
import { countryNameFormatter } from '../data/helpers/countryNameFormatter';

@customElement('be-map-country-dropdown')
export class BeMapCountryDropdown extends StateProvider {
	static styles = [
		...super.styles,
		css`
			select {
				width: 100%;
				word-break: break-word;
			}

			select[value=''] {
				font-style: italic;
			}

			select option {
				color: var(--rich-black);
				font-size: initial;
			}
		`
	];

	@property({ type: Array })
	countries: string[] = [];

	render() {
		return html`
			<select @input=${this.handleInput}>
				<option value="" ?selected=${live(this.state.selectedCountry === '')}>
					None selected
				</option>
				${repeat(
					this.countries,
					country => country,
					countryCode => {
						return html`<option
							value="${countryCode}"
							?selected=${live(this.state.selectedCountry === countryCode)}
						>
							${countryNameFormatter(countryCode)}
						</option>`;
					}
				)}
			</select>
		`;
	}

	handleInput(e: InputEvent & { target: { value: string } }) {
		this.state.selectedCountry = e.target!.value;
	}
}
