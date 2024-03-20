import { customElement } from 'lit/decorators.js';
import { StateProvider } from '../StateProvider';
import '../charts/BeMapLearningOutcomesChart';
import '../charts/BeMapLearningOutcomesTable';
import { css, html } from 'lit';

@customElement('be-map-outcome-indicators')
export class BeMapOutcomeIndicators extends StateProvider {
	static styles = [
		...super.styles,
		css`
			be-map-learning-outcomes-chart {
				margin-bottom: 3rem;
			}
		`
	];

	render() {
		return html` 
			${
				this.state.outcomeIndicatorsForSelectedCountry.length
					? html` <h4></h4>
								Percentage of Learners Targeted for USG Assistance who Attain
								Minimum Grade-Level Proficiency, as Reported by USAID Missions
							</h4>
							<be-map-learning-outcomes-chart></be-map-learning-outcomes-chart>
							<be-map-learning-outcomes-table></be-map-learning-outcomes-table>`
					: html`<em>No data available.</em>`
			}
			
		</h4>`;
	}
}
