import { customElement } from 'lit/decorators.js';
import { StateProvider } from '../StateProvider';
import { css, html } from 'lit';
import { US_NUMBER_FORMATTER } from '../helpers/US_NUMBER_FORMATTER';

@customElement('be-map-output-indicators')
export class BeMapOutputIndicators extends StateProvider {
	static styles = [
		...super.styles,
		css`
			.container {
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				gap: 1.5rem;
			}
			.container > article {
				margin-bottom: 0;
				flex: 0 1 33%;
			}

			@media screen and (max-width: 779px) {
				.container {
					grid-template-columns: repeat(2, 1fr);
				}
			}
		`
	];

	render() {
		return html`<div class="container">
			${this.state.outputIndicatorsForSelectedCountry
				? this.state.outputIndicatorsForSelectedCountry.indicators
						.filter(({ value }) => value > 0)
						.map(output => {
							return html`<article>
								<h2>${US_NUMBER_FORMATTER.format(output.value)}</h2>
								<p>${output.title}</p>
							</article>`;
						})
				: ''}
		</div>`;
	}
}
