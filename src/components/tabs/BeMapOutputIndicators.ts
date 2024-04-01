import { TemplateResult, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import {
	INDICATOR_LAYOUT,
	TOutputIndicatorLayout
} from '../../types/TOutputIndicator';
import { StateProvider } from '../StateProvider';
import { US_NUMBER_FORMATTER } from '../helpers/US_NUMBER_FORMATTER';

function renderListItems(
	outputs: { [k: string]: number },
	layout:
		| string
		| TOutputIndicatorLayout
		| TOutputIndicatorLayout[]
		| (string | TOutputIndicatorLayout | TOutputIndicatorLayout[])[],
	path: string
): TemplateResult {
	if (typeof layout === 'string') {
		return html`<li>
			${layout}:
			${US_NUMBER_FORMATTER.format(
				outputs[`${path ? `${path}:` : ''}${layout}`]
			)}
		</li>`;
	}

	if (layout.every(child => typeof child === 'string')) {
		return html`${layout.map(
			child =>
				html`<li>
					${child}:
					${US_NUMBER_FORMATTER.format(
						outputs[`${path ? `${path}:` : ''}${child}`]
					)}
				</li>`
		)}`;
	}

	if (layout.length === 2) {
		const [parent, children] = layout;

		return html`<li>
			${parent}
			<ul>
				${renderListItems(
					outputs,
					children as TOutputIndicatorLayout[],
					`${path ? `${path}:` : ''}${parent}`
				)}
			</ul>
		</li>`;
	}

	return html`${layout.map(child =>
		renderListItems(outputs, child as TOutputIndicatorLayout[], path)
	)}`;
}

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
				? html`${INDICATOR_LAYOUT.map(([section, data]) => {
						return html`<h4>${section}</h4>
							<ul>
								${renderListItems(
									this.state.outputIndicatorsForSelectedCountry!,
									data,
									''
								)}
							</ul>`;
				  })}`
				: html`<em>No data available.</em>`}
		`;
	}
}
