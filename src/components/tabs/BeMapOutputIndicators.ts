import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import {
	EIndicatorDemographic,
	EIndicatorEducationLevel,
	EIndicatorHeader
} from '../../types/TOutputIndicator';
import { StateProvider } from '../StateProvider';
import { US_NUMBER_FORMATTER } from '../helpers/US_NUMBER_FORMATTER';

const LEARNERS_REACHED_LEVELS: EIndicatorEducationLevel[] = [
	EIndicatorEducationLevel.PrePrimary,
	EIndicatorEducationLevel.PrimarySecondary,
	EIndicatorEducationLevel.TertiaryVocationOther
];

const LEARNERS_REACHED_DEMOS: (EIndicatorDemographic | string)[] = [
	EIndicatorDemographic.Males,
	EIndicatorDemographic.Females,
	EIndicatorDemographic.Disabilities,
	EIndicatorDemographic.AtRisk,
	'Total'
];

@customElement('be-map-output-indicators')
export class BeMapOutputIndicators extends StateProvider {
	static styles = [
		...super.styles,
		css`
			ul {
				margin-top: 0;
				list-style: none;
				padding: 0;
				display: flex;
				flex-direction: column;
			}

			.border-bottom {
				border-bottom: 1px solid var(--border);
			}
			ul > li {
				display: flex;
				flex-direction: row;
			}

			ul > li:not(ul ul li:first-child) {
				border-top: 1px solid var(--border);
				padding-top: 0.5rem;
			}
			ul > li:not(:last-child) {
				padding-bottom: 0.5rem;
			}

			li > :first-child {
				flex-basis: 33.333333%;
				flex-shrink: 2;
			}
			.space-between {
				justify-content: space-between;
			}
			.flex-grow {
				flex-grow: 1;
			}

			li > span + span {
				align-content: flex-end;
				font-weight: bold;
				color: var(--usaid-blue);
			}

			@media only screen and (max-width: 720px) {
				ul > li {
					flex-direction: column;
				}
				ul ul {
					margin-top: 0.5rem;
					padding-left: 2rem;
				}

				li.space-between {
					flex-direction: row;
				}

				li > :first-child {
					flex-basis: 75%;
				}
			}
		`
	];

	render() {
		if (!this.state.selectedCountryHasOutputIndicators) {
			return html`<h4>Results for Fiscal Year ${this.state.latestFY}</h4>
				<em>No data available.</em>`;
		}

		return html`
			<h4>Results for Fiscal Year ${this.state.latestFY}</h4>
			<p><em>Disaggregated data is provided where/when available.</em></p>
			${this.learnersReached} ${this.learnerInputs} ${this.learnerOutcomes}
		`;
	}

	get learnersReached() {
		if (!this.state.learnersReached) {
			return '';
		}

		return html`<h5>Learners Reached</h5>
			<ul>
				<li>
					<span>${EIndicatorHeader.Intervention}</span>
					<ul class="flex-grow">
						${LEARNERS_REACHED_LEVELS.filter(
							level => !!this.state.learnersReached![level]
						).map(level => {
							return html`<li>
								<span>${level}</span>
								<ul class="flex-grow">
									${LEARNERS_REACHED_DEMOS.map(demo => {
										return html`<li class="space-between">
											<span class="flex-grow">${demo}</span>
											<span
												>${US_NUMBER_FORMATTER.format(
													// @ts-ignore
													this.state.learnersReached[level][demo]
												)}</span
											>
										</li>`;
									})}
								</ul>
							</li>`;
						})}
						<li class="space-between flex-grow">
							<span>Total All Ages</span>
							<span
								>${US_NUMBER_FORMATTER.format(
									this.state.learnersReached.TotalAll as number
								)}</span
							>
						</li>
					</ul>
				</li>
			</ul>`;
	}

	get learnerInputs() {
		const hasHealth = Object.values(
			this.state.outputIndicatorsForSelectedCountryStructural[
				EIndicatorHeader.Health
			]
		).find(val => val > 0);

		const hasGovAssistance =
			this.state.outputIndicatorsForSelectedCountryStructural[
				EIndicatorHeader.GovAssitance
			];

		const hasProDev = Object.values(
			this.state.outputIndicatorsForSelectedCountryStructural[
				EIndicatorHeader.ProDev
			]
		).find(val => val > 0);

		const hasFacilitiesRepaired =
			this.state.outputIndicatorsForSelectedCountryStructural[
				EIndicatorHeader.FacilitiesRepaired
			];

		const hasLearningMaterials =
			this.state.outputIndicatorsForSelectedCountryStructural[
				EIndicatorHeader.LearningMaterials
			];

		if (
			!hasHealth &&
			!hasGovAssistance &&
			!hasProDev &&
			!hasFacilitiesRepaired &&
			!hasLearningMaterials
		) {
			return '';
		}

		return html`<h5>Learning Inputs</h5>
			<ul>
				${hasHealth
					? html`<li>
							<span>${EIndicatorHeader.Health}</span>
							<ul class="flex-grow">
								<li>
									<div></div>
									<ul class="flex-grow">
										${[
											EIndicatorDemographic.Males,
											EIndicatorDemographic.Females,
											'Total'
										].map(demo => {
											return html`<li class="space-between flex-grow">
												<span>${demo}</span>
												<span
													>${US_NUMBER_FORMATTER.format(
														// @ts-ignore
														this.state
															.outputIndicatorsForSelectedCountryStructural[
															EIndicatorHeader.Health
														][demo]
													)}</span
												>
											</li>`;
										})}
									</ul>
								</li>
							</ul>
					  </li>`
					: ''}
				${hasGovAssistance
					? html`
							<li class="space-between flex-grow">
								<span>${EIndicatorHeader.GovAssitance}</span>
								<span
									>${US_NUMBER_FORMATTER.format(
										this.state.outputIndicatorsForSelectedCountryStructural[
											EIndicatorHeader.GovAssitance
										]
									)}</span
								>
							</li>
					  `
					: ''}
				${hasProDev
					? html`<li>
							<span>${EIndicatorHeader.ProDev}</span>
							<ul class="flex-grow">
								<li>
									<div></div>
									<ul class="flex-grow">
										${[
											EIndicatorDemographic.Males,
											EIndicatorDemographic.Females,
											'Total'
										].map(demo => {
											return html`<li class="space-between flex-grow">
												<span>${demo}</span>
												<span
													>${US_NUMBER_FORMATTER.format(
														// @ts-ignore
														this.state
															.outputIndicatorsForSelectedCountryStructural[
															EIndicatorHeader.ProDev
														][demo]
													)}</span
												>
											</li>`;
										})}
									</ul>
								</li>
							</ul>
					  </li>`
					: ''}
				${hasFacilitiesRepaired
					? html`
							<li class="space-between flex-grow">
								<span>${EIndicatorHeader.FacilitiesRepaired}</span>
								<span
									>${US_NUMBER_FORMATTER.format(
										this.state.outputIndicatorsForSelectedCountryStructural[
											EIndicatorHeader.FacilitiesRepaired
										]
									)}</span
								>
							</li>
					  `
					: ''}
				${hasLearningMaterials
					? html`
							<li class="space-between flex-grow">
								<span>${EIndicatorHeader.LearningMaterials}</span>
								<span
									>${US_NUMBER_FORMATTER.format(
										this.state.outputIndicatorsForSelectedCountryStructural[
											EIndicatorHeader.LearningMaterials
										]
									)}</span
								>
							</li>
					  `
					: ''}
			</ul>`;
	}

	get learnerOutcomes() {
		const {
			[EIndicatorHeader.IncreasedAccess]: increasedAccess,
			[EIndicatorHeader.NewEmployment]: newEmployment,
			[EIndicatorHeader.SoftSkills]: softSkills
		} = this.state.outputIndicatorsForSelectedCountryStructural;

		if (!increasedAccess && !newEmployment && !softSkills) {
			return '';
		}

		return html`<h5>Learner Outcomes</h5>
			<ul>
				${increasedAccess
					? html`<li class="space-between flex-grow">
							<span>${[EIndicatorHeader.IncreasedAccess]}</span>
							<span>${US_NUMBER_FORMATTER.format(increasedAccess)}</span>
					  </li>`
					: ''}
				${newEmployment
					? html`<li class="space-between flex-grow">
							<span>${[EIndicatorHeader.NewEmployment]}</span>
							<span>${US_NUMBER_FORMATTER.format(newEmployment)}</span>
					  </li>`
					: ''}
				${softSkills
					? html`<li class="space-between flex-grow">
							<span>${[EIndicatorHeader.SoftSkills]}</span>
							<span>${US_NUMBER_FORMATTER.format(softSkills)}</span>
					  </li>`
					: ''}
			</ul>`;
	}
}
