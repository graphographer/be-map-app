import { HighlightableMap } from 'highlightable-map';
import { groupBy, mapValues, omitBy } from 'lodash-es';
import { makeAutoObservable, observable } from 'mobx';
import {
	nameToThreeAlphas,
	threeAlphasToName
} from '../data/countryNameTo3Alpha';
import { countryNameFormatter } from '../data/helpers/countryNameFormatter';
import { TEducationLevel } from '../types/EEducationLevel';
import { TAgency } from '../types/TAgency';
import { TAgencyActivity } from '../types/TAgencyActivity';
import { TAgencyPresence } from '../types/TAgencyPresence';
import { TDisbursementByAgency } from '../types/TDisbursementByAgency';
import { TLearningOutcome } from '../types/TLearningOutcome';
import { TOutputIndicator } from '../types/TOutputIndicator';

export class State {
	constructor() {
		makeAutoObservable(this, { data: false, filter: observable.ref });
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
		agencies?: TAgency[];
	} = {
		agencies: undefined,
		educationLevels: undefined
	};

	outcomeIndexesToChart: boolean[] = [];
	highlightOutcomeData: [number, number] | [] = [];
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

	get outputIndicatorsByCountry() {
		return Object.fromEntries(
			this.data.output_indicators
				.filter(output => output.indicators.find(({ value }) => value > 0))
				.map(output => [output.Country, output])
		);
	}
	get outputIndicatorsForSelectedCountry(): TOutputIndicator | undefined {
		return this.outputIndicatorsByCountry[this.selectedCountry];
	}

	get agencyEducationSupportByCountry(): Record<
		string,
		Record<TAgency, TEducationLevel[]>
	> {
		return mapValues(
			groupBy(this.data.agency_activity, 'Country'),
			activities => {
				const activitiesByAgency: Record<TAgency, TEducationLevel[]> =
					mapValues(
						groupBy(activities, 'Agency') as Record<TAgency, TAgencyActivity[]>,
						agencyActivities => {
							return [
								...agencyActivities.reduce<Set<TEducationLevel>>(
									(acc, activity) => {
										activity.educationLevels.forEach(level => acc.add(level));
										return acc;
									},
									new Set()
								)
							];
						}
					);

				return activitiesByAgency;
			}
		);
	}

	get agencyEducationSupportForSelectedCountry() {
		return this.agencyEducationSupportByCountry[this.selectedCountry];
	}

	get agencyDisbursementsForSelectedCountryAndFY(): Record<TAgency, number> {
		const { selectedCountry, selectedFiscalYear } = this;

		if (!selectedCountry && !selectedFiscalYear)
			return {} as Record<TAgency, number>;

		return mapValues(
			this.yearlyDisbursementsByCountryAndAgency[selectedCountry],
			agencyDisbursements => {
				return agencyDisbursements[selectedFiscalYear];
			}
		);
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

			if (!support) return acc;

			const country3Alpha = nameToThreeAlphas.get(Country) || Country;

			if (!acc[country3Alpha]) {
				acc[country3Alpha] = [];
			}

			acc[country3Alpha].push(Agency);

			return acc;
		}, {} as { [k: string]: TAgency[] });
	}

	get agenciesInSelectedCountry() {
		return this.agenciesInCountry[this.selectedCountry];
	}

	get numberOfAgencies() {
		return mapValues(this.agenciesInCountry, 'length');
	}

	get countries() {
		return Object.keys(this.agenciesInCountry);
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
		const { educationLevels, agencies } = this.filter;

		if (!educationLevels?.length && !agencies?.length) return this.countries;

		let filtered = [...Object.entries(this.activitiesByCountry)];

		if (educationLevels?.length) {
			filtered = filtered.filter(([, activities]) => {
				const allEducationLevels = activities.reduce<TEducationLevel[]>(
					(acc, { educationLevels }) => {
						acc.push(...educationLevels);
						return acc;
					},
					[]
				);
				return educationLevels.every(level =>
					allEducationLevels.includes(level)
				);
			});
		}
		if (agencies?.length) {
			filtered = filtered.filter(([, activities]) => {
				const allAgencies = activities.reduce<TAgency[]>((acc, { Agency }) => {
					acc.push(Agency);
					return acc;
				}, []);
				return agencies.some(agency => allAgencies.includes(agency));
			});
		}

		return filtered.map(([country]) => country);
	}

	get outcomeIndicatorsForSelectedCountry(): TLearningOutcome[] {
		return this.data.learning_outcomes.filter(
			outcome =>
				outcome.Country === this.selectedCountry &&
				outcome.outcomes.some(([_year, val]) => !isNaN(val))
		);
	}

	// get allLevelsMeasured() {
	// 	const levels = this.data.learning_outcomes.reduce((acc, outcome) => {
	// 		acc.add(outcome['Grade Level Measured']);
	// 		return acc;
	// 	}, new Set<string>());
	// 	return [...levels];
	// }

	selectedCountry: string = 'GTM';

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
