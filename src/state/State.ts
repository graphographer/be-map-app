import { HighlightableMap } from 'highlightable-map';
import { groupBy, mapKeys, mapValues, omitBy } from 'lodash-es';
import { makeAutoObservable, observable } from 'mobx';
import { nameToThreeAlphas } from '../data/countryNameTo3Alpha';
import { countryNameFormatter } from '../data/helpers/countryNameFormatter';
import { TEducationLevel } from '../types/EEducationLevel';
import { TAgency } from '../types/TAgency';
import { TAgencyActivity } from '../types/TAgencyActivity';
import { TAgencyPresence } from '../types/TAgencyPresence';
import { TDisbursementByAgency } from '../types/TDisbursementByAgency';
import { TLearningOutcome } from '../types/TLearningOutcome';

export class State {
	constructor() {
		makeAutoObservable(this, { data: false, filter: observable.ref });
	}
	data: {
		agency_presence: TAgencyPresence[];
		disbursement_by_agency: TDisbursementByAgency[];
		agency_activity: TAgencyActivity[];
		learning_outcomes: TLearningOutcome[];
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

	overviewFiscalYear: number = 2023;

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
			return !nameToThreeAlphas.has(country);
		});
	}

	get regionalAgencyDisbursements() {
		return omitBy(this.totalYearlyDisbursements, (_disbursement, country) => {
			return nameToThreeAlphas.has(country);
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

	get numberOfAgencies() {
		return mapValues(this.agenciesInCountry, 'length');
	}

	get countries() {
		return Object.keys(this.agenciesInCountry);
	}

	get activitiesByCountry(): { [k: string]: TAgencyActivity[] } {
		return mapKeys(
			groupBy(this.data.agency_activity, 'Country'),
			(_val, key) => {
				return nameToThreeAlphas.get(key);
			}
		);
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

	selectedCountry: string = 'MOZ';
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
