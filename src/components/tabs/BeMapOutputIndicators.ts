import { customElement } from 'lit/decorators.js';
import { StateProvider } from '../StateProvider';
import { css, html } from 'lit';
import { US_NUMBER_FORMATTER } from '../helpers/US_NUMBER_FORMATTER';

@customElement('be-map-output-indicators')
export class BeMapOutputIndicators extends StateProvider {
	static styles = [
		...super.styles,
		css`
			table {
				width: 100%;
			}

			table > tbody {
				border-bottom: none;
			}
			tbody td {
				padding: 1.5rem 2rem;
			}
			tbody td:nth-child(1) {
				text-align: right;
			}
			tbody tr:nth-child(odd) {
				background-color: var(--ultralight-blue);
			}

			tbody td:first-child {
				border-top-left-radius: 3px;
				border-bottom-left-radius: 3px;
			}
			tbody td:last-child {
				border-top-right-radius: 3px;
				border-bottom-right-radius: 3px;
			}
			tr h4 {
				margin: 0;
			}
		`
	];

	render() {
		return html`
			${this.state.outputIndicatorsForSelectedCountry
				? html`<table>			
							<tbody>
								${this.state.outputIndicatorsForSelectedCountry.indicators
									.filter(({ value }) => value > 0)
									.map(output => {
										return html`<tr scope="row">
											<td>
												<h4>${US_NUMBER_FORMATTER.format(output.value)}</h4>
											</td>
											<td>${output.title}</td>
										</tr>`;
									})}
							</tbody>
						</table>
				  </div>`
				: html`<em>No data available.</em>`}
		`;
	}
}

// ${this.state.outputIndicatorsForSelectedCountry
// 		? this.state.outputIndicatorsForSelectedCountry.indicators
// 					.filter(({ value }) => value > 0)
// 					.map(output => {
// 						return html`<article>
// 							<h2>${US_NUMBER_FORMATTER.format(output.value)}</h2>
// 							<p>${output.title}</p>
// 						</article>`;
// 					})
// 			: ''}
