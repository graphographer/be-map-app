import { HighlightableMap } from 'highlightable-map';
import {
	groupBy,
	isEmpty,
	mapValues,
	omitBy,
	pickBy,
	set,
	sortBy
} from 'lodash-es';
import { makeAutoObservable, observable, reaction } from 'mobx';
import { threeAlphasToName } from '../data/countryNameTo3Alpha';
import { countryNameFormatter } from '../data/helpers/countryNameFormatter';
import { EDUCATION_LEVELS, TEducationLevel } from '../types/EEducationLevel';
import { TAgency } from '../types/TAgency';
import { TAgencyActivity } from '../types/TAgencyActivity';
import { TAgencyPresence } from '../types/TAgencyPresence';
import { TDisbursementByAgency } from '../types/TDisbursementByAgency';
import { TLearningOutcome } from '../types/TLearningOutcome';
import {
	EIndicatorHeader,
	TOutputIndicator,
	TOutputIndicatorStructural
} from '../types/TOutputIndicator';

export class State {
	constructor() {
		makeAutoObservable(this, { data: false, filter: observable.ref });
		reaction(
			() => this.filter,
			() => {
				this.selectedCountry = '';
			}
		);
	}
	data: {
		agency_presence: TAgencyPresence[];
		disbursement_by_agency: TDisbursementByAgency[];
		agency_activity: TAgencyActivity[];
		learning_outcomes: TLearningOutcome[];
		output_indicators: TOutputIndicator[];
	} = {} as State['data'];

	highlightableMap!: HighlightableMap;

	filter: {
		educationLevels?: TEducationLevel[];
		agencies?: string[];
	} = {
		agencies: undefined,
		educationLevels: undefined
	};

	highlightOutcomeData: { datasetIndex?: number; yearIndex?: number } = {};

	setSelectedFiscalYear(fy: string) {
		this.selectedFiscalYear = fy;
	}
	selectedFiscalYear: string = '2023';

	fiscalYears = [2019, 2020, 2021, 2022, 2023];

	get yearlyDisbursementsByCountryAndAgency(): Record<
		string,
		Record<TAgency, Record<string, number>>
	> {
		const disbursementsByCountry = groupBy(
			this.data.disbursement_by_agency,
			'Country'
		);

		return mapValues(disbursementsByCountry, disbursements => {
			const agencyDisbursements = {} as Record<TAgency, Record<string, number>>;

			disbursements.forEach(disbursement => {
				const { Agency, Disbursements } = disbursement;
				agencyDisbursements[Agency] = Object.fromEntries(Disbursements);
			});

			return agencyDisbursements;
		});
	}

	get outputIndicatorsByCountry(): {
		[k: string]: TOutputIndicator;
	} {
		return Object.fromEntries(
			this.data.output_indicators
				// .filter(output => output.indicators.find(({ value }) => value > 0))
				.map(output => [output.Country, output])
		);
	}
	get outputIndicatorsForSelectedCountry():
		| { [k: string]: number }
		| undefined {
		return this.outputIndicatorsByCountry[this.selectedCountry]
			?.outputIndicators;
	}
	get outputIndicatorsForSelectedCountryStructural(): TOutputIndicatorStructural {
		const outputIndicatorsByCountryStructural =
			{} as TOutputIndicatorStructural;

		for (const key in this.outputIndicatorsForSelectedCountry) {
			const path = key.split(':');
			const val = this.outputIndicatorsForSelectedCountry[key];
			set(outputIndicatorsByCountryStructural, path, val);
		}

		return outputIndicatorsByCountryStructural;
	}
	get selectedCountryHasOutputIndicators() {
		return (
			this.outputIndicatorsForSelectedCountry &&
			Object.values(this.outputIndicatorsForSelectedCountry).find(
				val => val > 0
			)
		);
	}
	get learnersReached() {
		const interventions = pickBy(
			this.outputIndicatorsForSelectedCountryStructural[
				EIndicatorHeader.Intervention
			],
			demos => {
				return Object.values(demos).find(val => val > 0);
			}
		);

		if (isEmpty(interventions)) {
			return;
		}

		interventions.TotalAll =
			this.outputIndicatorsForSelectedCountryStructural[
				EIndicatorHeader.Intervention
			]['Total - All'];

		return interventions;
	}

	get agencyEducationSupportByCountry():
		| Record<string, Record<TAgency, TEducationLevel[]>>
		| undefined {
		if (!this.agenciesInSelectedCountry?.length) return;

		return mapValues(
			groupBy(this.data.agency_presence, 'Country'),
			presences => {
				const levelPresenceByAgency = Object.fromEntries(
					presences.map(presence => {
						const levels = pickBy(
							presence,
							(supported, key) =>
								supported &&
								(key === 'Education Levels Not Specified' ||
									EDUCATION_LEVELS.includes(key as TEducationLevel))
						);
						return [presence.Agency, Object.keys(levels)];
					})
				) as Record<TAgency, TEducationLevel[]>;

				return levelPresenceByAgency;
			}
		);
	}

	get agencyEducationSupportForSelectedCountry():
		| Record<TAgency, TEducationLevel[]>
		| undefined {
		return this.agencyEducationSupportByCountry?.[this.selectedCountry];
	}

	get latestFY() {
		return this.fiscalYears[this.fiscalYears.length - 1];
	}

	get agencyDisbursementsForSelectedCountryAndLatestFY():
		| Record<TAgency, number>
		| undefined {
		const { selectedCountry, latestFY } = this;

		if (!selectedCountry) return undefined;

		const latestDisbursements = mapValues(
			this.yearlyDisbursementsByCountryAndAgency[selectedCountry],
			agencyDisbursements => {
				return agencyDisbursements[latestFY];
			}
		);

		if (
			!Object.values(latestDisbursements).find(disbursement => disbursement > 0)
		)
			return undefined;

		return latestDisbursements;
	}

	get totalYearlyDisbursements(): {
		[k: string]: { [k: string]: number };
	} {
		return mapValues(
			groupBy(this.data.disbursement_by_agency, 'Country'),
			disbursements => {
				return disbursements.reduce<{ [k: string]: number }>(
					(acc, { Disbursements }) => {
						Disbursements.forEach(([year, amt]) => {
							if (typeof acc[year] !== 'number') {
								acc[year] = 0;
							}
							acc[year] += amt;
						});
						return acc;
					},
					{}
				);
			}
		);
	}

	get countryAgencyDisbursements() {
		return omitBy(this.totalYearlyDisbursements, (_disbursement, country) => {
			return !threeAlphasToName.has(country);
		});
	}

	get regionalAgencyDisbursements() {
		return omitBy(this.totalYearlyDisbursements, (_disbursement, country) => {
			return threeAlphasToName.has(country);
		});
	}

	get agenciesInCountry(): { [k: string]: TAgency[] } {
		return this.data.agency_presence.reduce((acc, presence) => {
			const { Country, Agency, 'Agency Support': support } = presence;

			if (!acc[Country]) {
				acc[Country] = [];
			}

			if (!support) {
				return acc;
			}

			acc[Country].push(Agency);

			return acc;
		}, {} as { [k: string]: TAgency[] });
	}

	get agenciesAndLevelsByCountry(): {
		[k: string]: { agencies: string[]; educationLevels: TEducationLevel[] };
	} {
		const byCountry = groupBy(this.data.agency_activity, 'Country');

		return mapValues(byCountry, activities => {
			const educationLevels = [
				...new Set(activities.flatMap(({ educationLevels }) => educationLevels))
			];
			const agencies = [
				...new Set(activities.map(({ agency_short }) => agency_short))
			];
			return {
				educationLevels,
				agencies
			};
		});
	}

	get agenciesInSelectedCountry(): TAgency[] | undefined {
		return this.agenciesInCountry[this.selectedCountry];
	}

	get numberOfAgencies() {
		return mapValues(this.agenciesInCountry, 'length');
	}

	get countries(): string[] {
		const countries = new Set(
			this.data.disbursement_by_agency
				.filter(({ Disbursements }) => Disbursements.find(([, amt]) => amt > 0))
				.map(({ Country }) => Country)
		);
		return sortBy([...countries], countryCode => {
			return threeAlphasToName.get(countryCode)?.[0];
		});
	}
	get countriesFormatted() {
		return this.countries.map(countryNameFormatter);
	}

	get activitiesByCountry(): { [k: string]: TAgencyActivity[] } {
		return groupBy(this.data.agency_activity, 'Country');
	}

	get activitiesForSelectedCountryByAgency() {
		return groupBy(
			this.activitiesByCountry[this.selectedCountry],
			'Agency'
		) as Record<TAgency, TAgencyActivity[]>;
	}

	get disbursementsForSelectedCountryByAgency(): [
		TAgency,
		TDisbursementByAgency
	][] {
		return this.data.disbursement_by_agency
			.filter(
				disbursement =>
					disbursement.Country === this.selectedCountry &&
					disbursement.Disbursements.some(([, amount]) => !!amount)
			)
			.map(disbursement => {
				return [disbursement.Agency, disbursement];
			});
	}

	get filteredCountries() {
		const { agencies: filterAgencies } = this.filter;

		// if (!filterEducationLevels?.length && !filterAgencies?.length)
		if (!filterAgencies?.length) return this.countries;

		let filtered = [...Object.entries(this.agenciesAndLevelsByCountry)];

		// if (filterEducationLevels?.length) {
		// 	filtered = filtered.filter(([, { educationLevels }]) => {
		// 		return filterEducationLevels.every(level =>
		// 			educationLevels.includes(level)
		// 		);
		// 	});
		// }
		if (filterAgencies?.length) {
			filtered = filtered.filter(([, { agencies }]) => {
				return filterAgencies.every(agency => agencies.includes(agency));
			});
		}

		return filtered.map(([country]) => country).sort();
	}

	get outcomeIndicatorsForSelectedCountry(): TLearningOutcome[] {
		return this.data.learning_outcomes.filter(
			outcome =>
				outcome.Country === this.selectedCountry &&
				outcome.outcomes.some(([_year, val]) => !isNaN(val))
		);
	}

	selectedCountry: string = '';

	get selectedCountryFormatted() {
		return countryNameFormatter(this.selectedCountry);
	}

	setCountry(country: string) {
		this.selectedCountry = country;
	}
	setFilter(filter: Partial<State['filter']>) {
		this.filter = { ...this.filter, ...filter };
	}
}
